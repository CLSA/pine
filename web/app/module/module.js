cenozoApp.defineModule({
  name: "module",
  dependencies: "page",
  models: ["add", "list", "view"],
  create: (module) => {
    cenozoApp.initQnairePartModule(module, "module");

    module.identifier.parent = {
      subject: "qnaire",
      column: "qnaire.name",
    };

    module.inputGroupList.findByProperty( "title", "" ).inputList.rank.isExcluded = function($state, model) {
      // don't show rank when qnaire has stages
      return "view" == model.getActionFromState() ? model.viewModel.record.stages : false;
    };

    module.addInput( "", "qnaire_id", { type: "hidden" } );
    module.addInput( "", "stages", { column: "qnaire.stages", type: "hidden" } );
    module.addInput(
      "",
      "stage_id",
      {
        column: "stage.id",
        title: "Stage",
        type: "enum",
        isExcluded: function($state, model) {
          // only show stage when qnaire has stages
          return "view" == model.getActionFromState() ? !model.viewModel.record.stages : true;
        },
      },
    );
    module.addInput(
      "",
      "stage_rank",
      {
        title: "Rank in Stage",
        type: "rank",
        isExcluded: function($state, model) {
          // only show stage-rank when qnaire has stages
          return "view" == model.getActionFromState() ? !model.viewModel.record.stages : true;
        }
      },
      "stage_id"
    );
    module.addInput("", "average_time", {
      title: "Average Time (seconds)",
      type: "string",
      isConstant: true,
      isExcluded: "add",
    });
    module.addInput("", "note", { title: "Note", type: "text" });
    module.addInput("", "first_page_id", { isExcluded: true });
    module.addInput("", "parent_name", {
      column: "qnaire.name",
      isExcluded: true,
    });
    cenozo.insertPropertyAfter(module.columnList, "name", "stage_name", {
      column: "stage.name",
      title: "Stage",
      type: "string",
      isIncluded: function ($state, model) {
        return model.listModel.stages;
      },
    });
    cenozo.insertPropertyAfter(
      module.columnList,
      "page_count",
      "average_time",
      {
        title: "Average Time",
        type: "seconds",
      }
    );

    module.addExtraOperation("view", {
      title: "Preview",
      isDisabled: function ($state, model) {
        return !model.viewModel.record.first_page_id;
      },
      operation: async function ($state, model) {
        await $state.go(
          "page.render",
          { identifier: model.viewModel.record.first_page_id },
          { reload: true }
        );
      },
    });

    /* ############################################################################################## */
    cenozo.providers.directive("cnModuleClone", [
      "CnQnairePartCloneFactory",
      "CnModuleModelFactory",
      "CnSession",
      "$state",
      function (CnQnairePartCloneFactory, CnModuleModelFactory, CnSession, $state) {
        return {
          templateUrl: cenozoApp.getFileUrl(
            "pine",
            "qnaire_part_clone.tpl.html"
          ),
          restrict: "E",
          scope: { model: "=?" },
          controller: async function ($scope) {
            if (angular.isUndefined($scope.model)) {
              $scope.model = CnQnairePartCloneFactory.instance("module");
              $scope.model.parentModel = CnModuleModelFactory.root;
            }

            await $scope.model.onLoad();

            CnSession.setBreadcrumbTrail([
              {
                title: "Questionnaire",
                go: async function () {
                  await $state.go("qnaire.list");
                },
              },
              {
                title: $scope.model.parentSourceName,
                go: async function () {
                  await $state.go("qnaire.view", {
                    identifier: $scope.model.sourceParentId,
                  });
                },
              },
              {
                title: "Modules",
              },
              {
                title: $scope.model.sourceName,
                go: async function () {
                  await $state.go("module.view", {
                    identifier: $scope.model.sourceId,
                  });
                },
              },
              {
                title: "move/copy",
              },
            ]);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnModuleListFactory", [
      "CnBaseListFactory",
      "CnHttpFactory",
      function (CnBaseListFactory, CnHttpFactory) {
        var object = function (parentModel) {
          CnBaseListFactory.construct(this, parentModel);

          angular.extend(this, {
            stages: false,
            onList: async function (replace) {
              await this.$$onList(replace);
              if (
                replace &&
                "qnaire" == this.parentModel.getSubjectFromState() &&
                "view" == this.parentModel.getActionFromState()
              ) {
                var response = await CnHttpFactory.instance({
                  path: this.parentModel
                    .getServiceCollectionPath()
                    .replace("/module", ""),
                  data: { select: { column: "stages" } },
                }).get();

                this.stages = response.data.stages;
              }
            },
          });
        };
        return {
          instance: function (parentModel) {
            return new object(parentModel);
          },
        };
      },
    ]);

    // extend the view factory created by caling initQnairePartModule()
    cenozo.providers.decorator("CnModuleViewFactory", [
      "$delegate",
      "$filter",
      "CnHttpFactory",
      function ($delegate, $filter, CnHttpFactory) {
        var instance = $delegate.instance;
        $delegate.instance = function (parentModel, root) {
          var object = instance(parentModel, root);

          angular.extend(object, {
            onView: async function (force) {
              if( angular.isDefined( this.parentModel.metadata.columnList ) )
                this.parentModel.metadata.columnList.stage_id.enumList = [];
              await this.$$onView(force);
              this.record.average_time = $filter("cnSeconds")(
                Math.round(this.record.average_time)
              );

              if( this.record.stages ) {
                const [stageResponse, moduleCountResponse] = await Promise.all([
                  CnHttpFactory.instance({
                    path: ['qnaire', this.record.qnaire_id, 'stage'].join("/"),
                    data: {
                      select: { column: ['id', 'rank', 'name'] },
                      modifier: { order: 'stage.rank' },
                    }
                  }).query(),

                  CnHttpFactory.instance({
                    path: ['stage', this.record.stage_id, 'module'].join( "/" ),
                  }).count()
                ]);

                this.parentModel.metadata.columnList.stage_id.enumList =
                  stageResponse.data.reduce((list, item) => {
                    list.push({ value: item.id, name: item.rank + ") " + item.name });
                    return list;
                  }, []);

                this.parentModel.metadata.columnList.stage_rank.enumList = [];
                const maxRank = parseInt(moduleCountResponse.headers("Total"));
                for( var rank = 1; rank <= maxRank; rank++ ) {
                  this.parentModel.metadata.columnList.stage_rank.enumList.push({
                    value: rank,
                    name: $filter("cnOrdinal")(rank),
                  });
                }
              }
            },
            onPatch: async function (data) {
              await this.$$onPatch(data);
              await this.parentModel.reloadState(true);
            },
          });

          return object;
        };

        return $delegate;
      },
    ]);
  },
});
