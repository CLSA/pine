cenozoApp.defineModule({
  name: "qnaire_participant_trigger",
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
        singular: "participant trigger",
        plural: "participant triggers",
        possessive: "participant trigger's",
      },
      columnList: {
        question: {
          title: "Question",
          column: "question.name",
        },
        answer_value: {
          title: "Required Answer",
        },
        column_name: {
          title: "Participant Column",
        },
        value: {
          title: "Value",
        },
      },
      defaultOrder: {
        column: "question.rank",
        reverse: false,
      },
    });

    module.addInputGroup("", {
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
      column_name: {
        title: "Participant Column",
        type: "enum",
      },
      value: {
        title: "Value",
        type: "string",
        help: "Only boolean values (true or false) are currently accepted.",
      },
      qnaire_id: { column: "qnaire.id", type: "hidden" },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnQnaireParticipantTriggerAddFactory", [
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
    cenozo.providers.factory("CnQnaireParticipantTriggerViewFactory", [
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
  },
});
