cenozoApp.defineModule({
  name: "question_option",
  models: ["add", "list", "view"],
  create: (module) => {
    cenozoApp.initQnairePartModule(module, "question_option");

    module.identifier.parent = {
      subject: "question",
      column: "question.id",
    };

    angular.extend(module.columnList, {
      exclusive: { title: "Exclusive", type: "boolean" },
      extra: { title: "Extra", type: "string" },
      multiple_answers: { title: "Multiple Answers", type: "boolean" },
    });

    module.addInput("", "exclusive", { title: "Exclusive", type: "boolean" });
    module.addInput("", "extra", { title: "Extra", type: "enum" });
    module.addInput("", "multiple_answers", {
      title: "Multiple Answers",
      type: "boolean",
      isExcluded: function ($state, model) {
        return !model.viewModel.record.extra ? true : "add";
      },
    });
    module.addInput("", "unit_list", {
      title: "Unit List",
      type: "text",
      help:
        'Must be defined in JSON format.  For example:<br>\n' +
        '[ "mg", "IU" ]<br>\n' +
        'or<br>\n' +
        '[ { "MG": "mg" }, { "IU": { "en": "IU", "fr": "U. I." } } ]<br>\n' +
        'or<br>\n' +
        '{ "MG": "mg", "IU": { "en": "IU", "fr": "U. I." } }',
      isExcluded: function ($state, model) {
        return "number with unit" != model.viewModel.record.extra ? true : "add";
      },
    });
    module.addInput("", "minimum", {
      title: "Minimum",
      type: "string",
      isExcluded: function ($state, model) {
        return !["date", "number", "number with unit"].includes(model.viewModel.record.extra)
          ? true
          : "add";
      },
      help: "The minimum possible value for this option's extra value.",
    });
    module.addInput("", "maximum", {
      title: "Maximum",
      type: "string",
      isExcluded: function ($state, model) {
        return !["date", "number", "number with unit", "string", "text"].includes(model.viewModel.record.extra)
          ? true
          : "add";
      },
      help: "The maximum possible value for this question's extra value, or the maximum number of characters for string or text.",
    });
    module.addInput("", "parent_name", {
      column: "question.name",
      isExcluded: true,
    });

    /* ############################################################################################## */
    cenozo.providers.directive("cnQuestionOptionClone", [
      "CnQnairePartCloneFactory",
      "CnQuestionOptionModelFactory",
      "CnSession",
      "$state",
      function (CnQnairePartCloneFactory, CnQuestionOptionModelFactory, CnSession, $state) {
        return {
          templateUrl: cenozoApp.getFileUrl(
            "pine",
            "qnaire_part_clone.tpl.html"
          ),
          restrict: "E",
          scope: { model: "=?" },
          controller: async function ($scope) {
            if (angular.isUndefined($scope.model)) {
              $scope.model = CnQnairePartCloneFactory.instance("question_option");
              $scope.model.parentModel = CnQuestionOptionModelFactory.root;
            }

            await $scope.model.onLoad();

            CnSession.setBreadcrumbTrail([
              {
                title: "Page",
                go: async function () {
                  await $state.go("question.list");
                },
              },
              {
                title: $scope.model.parentSourceName,
                go: async function () {
                  await $state.go("question.view", {
                    identifier: $scope.model.sourceParentId,
                  });
                },
              },
              {
                title: "Question Options",
              },
              {
                title: $scope.model.sourceName,
                go: async function () {
                  await $state.go("question_option.view", {
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

    // extend the view factory created by caling initQnairePartModule()
    cenozo.providers.decorator("CnQuestionOptionViewFactory", [
      "$delegate",
      "CnHttpFactory",
      "CnModalConfirmFactory",
      function ($delegate, CnHttpFactory, CnModalConfirmFactory) {
        var instance = $delegate.instance;
        $delegate.instance = function (parentModel, root) {
          var object = instance(parentModel, root);

          // when changing the extra value the multiple-answers, min and max columns are automatically updated by the DB
          angular.extend(object, {
            onPatch: async function (data) {
              var proceed = true;

              // warn if changing name will cause automatic change to preconditions
              if (angular.isDefined(data.name)) {
                var response = await CnHttpFactory.instance({
                  path: object.parentModel.getServiceResourcePath(),
                  data: { select: { column: "qnaire_dependencies" } },
                }).query();

                const dependencies = JSON.parse(response.data.qnaire_dependencies);
                if (null != dependencies) {
                  var message =
                    "The following parts of the questionnaire refer to this question-option in their " +
                    "precondition and will automatically be updated to refer to the question option's new name:\n";

                  for (const table in dependencies) {
                    const tableName = table.replace(/_/, " ").ucWords();
                    for (const column in dependencies[table]) {
                      message += "\n" + tableName + " " + column + ": " + dependencies[table][column].join(", ");
                    }
                  }

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
              }

              if (proceed) {
                await object.$$onPatch(data);

                if (angular.isDefined(data.extra)) {
                  if (!data.extra) object.record.multiple_answers = false;
                  if ("number with unit" != object.record.extra) object.record.unit_list = null;
                  if (!["date", "number", "number with unit"].includes(data.extra)) {
                    object.record.minimum = "";
                    if (!["string", "text"].includes(data.extra)) object.record.maximum = "";
                  }
                }
              }
            },
          });

          return object;
        };

        return $delegate;
      },
    ]);
  },
});
