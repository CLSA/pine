cenozoApp.defineModule({
  name: "device",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "qnaire",
          column: "qnaire.id",
        },
      },
      name: {
        singular: "device",
        plural: "devices",
        possessive: "device's",
      },
      columnList: {
        name: {
          title: "Name",
          column: "device.name",
        },
        url: {
          title: "URL",
          column: "device.url",
        },
      },
      defaultOrder: {
        column: "device.name",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      name: {
        title: "Name",
        type: "string",
      },
      url: {
        title: "URL",
        type: "string",
      },
    });

    module.addExtraOperation("view", {
      title: "Test Connection",
      operation: async function ($state, model) {
        try {
          this.working = true;
          await model.viewModel.testConnection();
        } finally {
          this.working = false;
        }
      },
      isDisabled: function ($state, model) {
        return this.working;
      },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnDeviceViewFactory", [
      "CnBaseViewFactory",
      "CnHttpFactory",
      "CnModalMessageFactory",
      function (CnBaseViewFactory, CnHttpFactory, CnModalMessageFactory) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);

          this.testConnection = async function () {
            var modal = CnModalMessageFactory.instance({
              title: "Test Connection",
              message:
                "Please wait while the connection to this device is tested.",
              block: true,
            });

            modal.show();
            var response = await CnHttpFactory.instance({
              path: "device/" + this.record.id + "?action=test_connection",
            }).get();
            modal.close();

            await CnModalMessageFactory.instance({
              title: "Test Connection",
              message: response.data
                ? "Connection succesful."
                : "Connection failed.",
            }).show();
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
