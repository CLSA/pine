cenozoApp.defineModule({
  name: "qnaire_equipment_type_trigger",
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
        singular: "equipment trigger",
        plural: "equipment triggers",
        possessive: "equipment trigger's",
      },
      columnList: {
        equipment_type: {
          title: "Equipment Type",
          column: "equipment_type.name",
        },
        question: {
          title: "Question",
          column: "question.name",
        },
        loaned: {
          title: "Loan",
          type: "boolean",
        },
      },
      defaultOrder: {
        column: "question.rank",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      equipment_type_id: {
        title: "Equipment Type",
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
      loaned: {
        title: "Loan",
        type: "boolean",
        help:
          'Set to "Yes" if this question triggers the loaning of equipment, ' +
          'or "No" if it triggers the returning of equipment.'
      },
      qnaire_id: { column: "qnaire.id", type: "hidden" },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnQnaireEquipmentTypeTriggerAddFactory", [
      "CnBaseAddFactory",
      function (CnBaseAddFactory) {
        var object = function (parentModel) {
          CnBaseAddFactory.construct(this, parentModel);

          this.onNew = async function (record) {
            await this.$$onNew(record);

            // update the question_id's typeahead table value (restrict to questions belonging to current qnaire only)
            var inputList = this.parentModel.module.inputGroupList.findByProperty("title", "").inputList;
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
    cenozo.providers.factory("CnQnaireEquipmentTypeTriggerViewFactory", [
      "CnBaseViewFactory",
      function (CnBaseViewFactory) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);

          this.onView = async function (force) {
            await this.$$onView(force);

            // update the question_id's typeahead table value (restrict to questions belonging to current qnaire only)
            var inputList = this.parentModel.module.inputGroupList.findByProperty("title", "").inputList;
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
    cenozo.providers.factory("CnQnaireEquipmentTypeTriggerModelFactory", [
      "CnBaseModelFactory",
      "CnQnaireEquipmentTypeTriggerAddFactory",
      "CnQnaireEquipmentTypeTriggerListFactory",
      "CnQnaireEquipmentTypeTriggerViewFactory",
      "CnHttpFactory",
      function (
        CnBaseModelFactory,
        CnQnaireEquipmentTypeTriggerAddFactory,
        CnQnaireEquipmentTypeTriggerListFactory,
        CnQnaireEquipmentTypeTriggerViewFactory,
        CnHttpFactory
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.addModel = CnQnaireEquipmentTypeTriggerAddFactory.instance(this);
          this.listModel = CnQnaireEquipmentTypeTriggerListFactory.instance(this);
          this.viewModel = CnQnaireEquipmentTypeTriggerViewFactory.instance(this, root);

          // extend getMetadata
          this.getMetadata = async function () {
            await this.$$getMetadata();

            var response = await CnHttpFactory.instance({
              path: "equipment_type",
              data: {
                select: { column: ["id", "name"] },
                modifier: { order: "name", limit: 1000 },
              },
            }).query();

            this.metadata.columnList.equipment_type_id.enumList =
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
