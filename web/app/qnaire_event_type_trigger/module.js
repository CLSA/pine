cenozoApp.defineModule({
  name: "qnaire_event_type_trigger",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "qnaire",
          column: "qnaire.name",
        },
      },
      name: {
        singular: "event trigger",
        plural: "event triggers",
        possessive: "event trigger's",
      },
      columnList: {
        event_type: {
          title: "Event Type",
          column: "event_type.name",
        },
        question: {
          title: "Question",
          column: "question.name",
        },
        answer_value: {
          title: "Required Answer",
        },
      },
      defaultOrder: {
        column: "question.rank",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      event_type_id: {
        title: "Event Type",
        type: "enum",
      },
      question_id: {
        title: "Question",
        type: "lookup-typeahead",
        typeahead: {
          table: null, // filled out by the add and view factories below
          select: 'CONCAT( question.name, " (", question.type, ")" )',
          where: "question.name",
        },
        isExcluded: function ($state, model) {
          // don't include the question_id when we're adding from a question already
          return "question" == model.getSubjectFromState();
        },
      },
      answer_value: {
        title: "Required Answer",
        type: "string",
      },
      qnaire_id: { column: "qnaire.id", type: "hidden" },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnQnaireEventTypeTriggerAddFactory", [
      "CnBaseAddFactory",
      function (CnBaseAddFactory) {
        var object = function (parentModel) {
          CnBaseAddFactory.construct(this, parentModel);

          this.onNew = async function (record) {
            await this.$$onNew(record);

            // update the question_id's typeahead table value (restrict to questions belonging to current qnaire only)
            var inputList =
              this.parentModel.module.inputGroupList.findByProperty(
                "title",
                ""
              ).inputList;
            inputList.question_id.typeahead.table = [
              "qnaire",
              this.parentModel.getParentIdentifier().identifier,
              "question",
            ].join("/");
          };
        };
        return {
          instance: function (parentModel) {
            return new object(parentModel);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnQnaireEventTypeTriggerViewFactory", [
      "CnBaseViewFactory",
      function (CnBaseViewFactory) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);

          this.onView = async function (force) {
            await this.$$onView(force);

            // update the question_id's typeahead table value (restrict to questions belonging to current qnaire only)
            var inputList =
              this.parentModel.module.inputGroupList.findByProperty(
                "title",
                ""
              ).inputList;
            inputList.question_id.typeahead.table = [
              "qnaire",
              this.record.qnaire_id,
              "question",
            ].join("/");
          };
        };
        return {
          instance: function (parentModel, root) {
            return new object(parentModel, root);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnQnaireEventTypeTriggerModelFactory", [
      "CnBaseModelFactory",
      "CnQnaireEventTypeTriggerAddFactory",
      "CnQnaireEventTypeTriggerListFactory",
      "CnQnaireEventTypeTriggerViewFactory",
      "CnHttpFactory",
      function (
        CnBaseModelFactory,
        CnQnaireEventTypeTriggerAddFactory,
        CnQnaireEventTypeTriggerListFactory,
        CnQnaireEventTypeTriggerViewFactory,
        CnHttpFactory
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.addModel = CnQnaireEventTypeTriggerAddFactory.instance(this);
          this.listModel = CnQnaireEventTypeTriggerListFactory.instance(this);
          this.viewModel = CnQnaireEventTypeTriggerViewFactory.instance(
            this,
            root
          );

          // extend getMetadata
          this.getMetadata = async function () {
            await this.$$getMetadata();

            var response = await CnHttpFactory.instance({
              path: "event_type",
              data: {
                select: { column: ["id", "name"] },
                modifier: { order: "name", limit: 1000 },
              },
            }).query();

            this.metadata.columnList.event_type_id.enumList =
              response.data.reduce((list, item) => {
                list.push({ value: item.id, name: item.name });
                return list;
              }, []);
          };
        };

        return {
          root: new object(true),
          instance: function () {
            return new object(false);
          },
        };
      },
    ]);
  },
});
