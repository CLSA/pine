cenozoApp.defineModule({
  name: "response_stage",
  models: "list",
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "qnaire",
          column: "qnaire.id",
        },
      },
      name: {
        singular: "response stage",
        plural: "response stages",
        possessive: "response stage's",
      },
      columnList: {
        stage_rank: {
          title: "Rank",
          column: "stage.rank",
        },
        stage_name: {
          title: "Name",
          column: "stage.name",
        },
        status: {
          title: "Status",
          column: "response_stage.status",
          highlight: "active",
        },
        user: {
          title: "User",
          column: "user.name",
        },
        deviation_type: {
          title: "Deviation",
          column: "deviation_type.name",
        },
        start_datetime: {
          title: "Start Date & Time",
          type: "datetimesecond",
        },
        end_datetime: {
          title: "End Date & Time",
          type: "datetimesecond",
        },
        elapsed: {
          title: "Elapsed",
          type: "seconds"
        },
        comments: {
          title: "Comments",
          type: "text",
          limit: null,
        },
      },
      defaultOrder: {
        column: "stage.rank",
        reverse: false,
      },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnResponseStageModelFactory", [
      "CnBaseModelFactory",
      "CnResponseStageListFactory",
      function (CnBaseModelFactory, CnResponseStageListFactory) {
        var object = function (root) {
          var self = this;
          CnBaseModelFactory.construct(this, module);
          this.listModel = CnResponseStageListFactory.instance(this);
          this.getViewEnabled = function () {
            return false;
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
