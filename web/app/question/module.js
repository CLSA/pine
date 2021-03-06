cenozoApp.defineModule({
  name: "question",
  dependencies: "question_option",
  models: ["add", "list", "view"],
  create: (module) => {
    cenozoApp.initQnairePartModule(module, "question");

    module.identifier.parent = {
      subject: "page",
      column: "page.id",
    };

    // The column list is different when looking at a qnaire's list of questions
    angular.extend(module.columnList, {
      module_name: {
        column: "module.name",
        title: "Module",
        isIncluded: function ($state, model) {
          return "qnaire" == model.getSubjectFromState();
        },
      },
      page_name: {
        column: "page.name",
        title: "Page",
        isIncluded: function ($state, model) {
          return "qnaire" == model.getSubjectFromState();
        },
      },
      question_name: {
        column: "question.name",
        title: "Question",
        isIncluded: function ($state, model) {
          return "qnaire" == model.getSubjectFromState();
        },
      },
      type: { title: "Type" },
      export: { title: "Exported", type: "boolean" },
    });

    module.columnList.rank.isIncluded = function ($state, model) {
      return "qnaire" != model.getSubjectFromState();
    };
    module.columnList.name.isIncluded = function ($state, model) {
      return "qnaire" != model.getSubjectFromState();
    };
    module.columnList.question_option_count.isIncluded = function (
      $state,
      model
    ) {
      return "qnaire" != model.getSubjectFromState();
    };
    module.columnList.precondition.isIncluded = function ($state, model) {
      return "qnaire" != model.getSubjectFromState();
    };

    module.addInput("", "type", { title: "Type", type: "enum" });
    module.addInput("", "export", {
      title: "Export",
      type: "boolean",
      help: "Whether answers to this question are exported.",
    });
    module.addInput("", "dkna_allowed", {
      title: "Allow DKNA",
      type: "boolean",
      isExcluded: function ($state, model) {
        return "comment" == model.viewModel.record.type ? true : "add";
      },
    });
    module.addInput("", "refuse_allowed", {
      title: "Allow Refuse",
      type: "boolean",
      isExcluded: function ($state, model) {
        return "comment" == model.viewModel.record.type ? true : "add";
      },
    });
    module.addInput("", "device_id", {
      title: "Device",
      type: "enum",
      isExcluded: function ($state, model) {
        return "device" != model.viewModel.record.type ? true : "add";
      },
    });
    module.addInput("", "minimum", {
      title: "Minimum",
      type: "string",
      isExcluded: function ($state, model) {
        return !["date", "number"].includes(model.viewModel.record.type)
          ? true
          : "add";
      },
      help: "The minimum possible value for this question.",
    });
    module.addInput("", "maximum", {
      title: "Maximum",
      type: "string",
      isExcluded: function ($state, model) {
        return !["audio", "date", "number"].includes(
          model.viewModel.record.type
        )
          ? true
          : "add";
      },
      help: "The maximum possible value for this question (or maximum number of seconds for audio recordings).",
    });
    module.addInput("", "default_answer", {
      title: "Default Answer",
      type: "string",
    });
    module.addInput("", "note", { title: "Note", type: "text" });
    module.addInput("", "parent_name", {
      column: "page.name",
      isExcluded: true,
    });
    module.addInput("", "question_option_count", { isExcluded: true });
    module.addInput("", "qnaire_id", { column: "qnaire.id", isExcluded: true });

    /* ############################################################################################## */
    cenozo.providers.directive("cnQuestionClone", [
      "CnQnairePartCloneFactory",
      "CnSession",
      "$state",
      function (CnQnairePartCloneFactory, CnSession, $state) {
        return {
          templateUrl: cenozoApp.getFileUrl(
            "pine",
            "qnaire_part_clone.tpl.html"
          ),
          restrict: "E",
          scope: { model: "=?" },
          controller: async function ($scope) {
            if (angular.isUndefined($scope.model))
              $scope.model = CnQnairePartCloneFactory.instance("question");

            await $scope.model.onLoad();
            CnSession.setBreadcrumbTrail([
              {
                title: "Page",
                go: async function () {
                  await $state.go("page.list");
                },
              },
              {
                title: $scope.model.parentSourceName,
                go: async function () {
                  await $state.go("page.view", {
                    identifier: $scope.model.sourceParentId,
                  });
                },
              },
              {
                title: "Questions",
              },
              {
                title: $scope.model.sourceName,
                go: async function () {
                  await $state.go("question.view", {
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
    cenozo.providers.factory("CnQuestionListFactory", [
      "CnBaseListFactory",
      function (CnBaseListFactory) {
        var object = function (parentModel) {
          CnBaseListFactory.construct(this, parentModel);
        };
        return {
          instance: function (parentModel) {
            // if we are looking at the list of questions in a qnaire then we must change the default column order
            var obj = new object(parentModel);
            if ("qnaire" == parentModel.getSubjectFromState())
              obj.order.column = "module.rank";
            return obj;
          },
        };
      },
    ]);

    // extend the model factory
    cenozo.providers.decorator("CnQuestionViewFactory", [
      "$delegate",
      "CnHttpFactory",
      "CnModalConfirmFactory",
      function ($delegate, CnHttpFactory, CnModalConfirmFactory) {
        var instance = $delegate.instance;
        $delegate.instance = function (parentModel, root) {
          // if we are looking at the list of questions in a qnaire then we must change the default column order
          var object = instance(parentModel, root);
          angular.extend(object, {
            getChildList: function () {
              return object
                .$$getChildList()
                .filter(
                  (child) =>
                    "list" == object.record.type ||
                    "question_option" != child.subject.snake
                );
            },

            onView: async function (force) {
              await this.$$onView(force);
              await this.parentModel.updateDeviceList();
            },

            onPatch: async function (data) {
              var proceed = true;

              // see if we're changing from a list question which would result in deleting options
              var removingOptions =
                angular.isDefined(data.type) &&
                "list" != object.record.type &&
                0 < object.record.question_option_count;

              // warn if changing name will cause automatic change to preconditions
              if (angular.isDefined(data.name)) {
                var response = await CnHttpFactory.instance({
                  path: object.parentModel.getServiceResourcePath(),
                  data: {
                    select: {
                      column: [
                        "module_precondition_dependencies",
                        "page_precondition_dependencies",
                        "question_precondition_dependencies",
                        "question_option_precondition_dependencies",
                      ],
                    },
                  },
                }).query();

                if (
                  null != response.data.module_precondition_dependencies ||
                  null != response.data.page_precondition_dependencies ||
                  null != response.data.question_precondition_dependencies ||
                  null !=
                    response.data.question_option_precondition_dependencies
                ) {
                  var message =
                    "The following parts of the questionnaire refer to this question in their precondition and will " +
                    "automatically be updated to refer to the question's new name:\n";
                  if (null != response.data.module_precondition_dependencies)
                    message +=
                      "\nModule(s): " +
                      response.data.module_precondition_dependencies;
                  if (null != response.data.page_precondition_dependencies)
                    message +=
                      "\nPage(s): " +
                      response.data.page_precondition_dependencies;
                  if (null != response.data.question_precondition_dependencies)
                    message +=
                      "\nQuestion(s): " +
                      response.data.question_precondition_dependencies;
                  if (
                    null !=
                    response.data.question_option_precondition_dependencies
                  )
                    message +=
                      "\nQuestion Option(s): " +
                      response.data.question_option_precondition_dependencies;
                  message += "\n\nAre you sure you wish to proceed?";

                  var response = await CnModalConfirmFactory.instance({
                    message: message,
                  }).show();

                  if (!response) {
                    // put the old value back
                    object.record.name = object.backupRecord.name;
                    proceed = false;
                  }
                }
              } else if (removingOptions) {
                var response = await CnModalConfirmFactory.instance({
                  message:
                    "By changing this question's type to \"" +
                    object.record.type +
                    '" ' +
                    object.record.question_option_count +
                    " question option" +
                    (1 == object.record.question_option_count ? "" : "s") +
                    " will be deleted. " +
                    "Are you sure you wish to proceed?",
                }).show();

                if (!response) {
                  // put the old value back
                  object.record.type = object.backupRecord.type;
                  proceed = false;
                }
              } else if (
                angular.isDefined(data.type) &&
                !["device", "date", "number"].includes(object.record.type)
              ) {
                if (object.record.device_id) object.record.device_id = "";
                if (null != object.record.minimum) object.record.minimum = null;
                if (null != object.record.maximum) object.record.maximum = null;
              }

              if (proceed) {
                await object.$$onPatch(data);

                if (removingOptions) {
                  // update the question option list since we may have deleted them
                  if (
                    0 < response.length &&
                    angular.isDefined(object.questionOptionModel)
                  )
                    await object.questionOptionModel.listModel.onList(true);
                }
              }
            },
          });
          return object;
        };

        return $delegate;
      },
    ]);

    // extend the base model factory created by caling initQnairePartModule()
    cenozo.providers.decorator("CnQuestionModelFactory", [
      "$delegate",
      "CnHttpFactory",
      function ($delegate, CnHttpFactory) {
        function extendModelObject(object) {
          angular.extend(object, {
            getAddEnabled: function () {
              // don't allow the add button while viewing the qnaire
              return (
                "qnaire" != object.getSubjectFromState() &&
                object.$$getAddEnabled()
              );
            },
            getDeleteEnabled: function () {
              // don't allow the add button while viewing the qnaire
              return (
                !object.viewModel.record.readonly &&
                "qnaire" != object.getSubjectFromState() &&
                object.$$getDeleteEnabled()
              );
            },
            // special function to update the device list
            updateDeviceList: async function () {
              var response = await CnHttpFactory.instance({
                path: [
                  "qnaire",
                  this.viewModel.record.qnaire_id,
                  "device",
                ].join("/"),
                data: {
                  select: { column: ["id", "name"] },
                  modifier: { order: "name" },
                },
              }).query();

              this.metadata.columnList.device_id.enumList =
                response.data.reduce((list, item) => {
                  list.push({ value: item.id, name: item.name });
                  return list;
                }, []);
            },
          });
          return object;
        }

        var instance = $delegate.instance;
        $delegate.root = extendModelObject($delegate.root);
        $delegate.instance = function (parentModel, root) {
          return extendModelObject(instance(root));
        };

        return $delegate;
      },
    ]);
  },
});
