cenozoApp.defineModule({
  name: "device_data",
  models: ["add", "list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "device",
          column: "device.id",
        },
      },
      name: {
        singular: "device data",
        plural: "device data",
        possessive: "device data's",
      },
      columnList: {
        name: {
          title: "Name",
          column: "device_data.name",
        },
        code: {
          title: "Code",
          column: "device_data.code",
        },
      },
      defaultOrder: {
        column: "device_data.name",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      name: {
        title: "Name",
        type: "string",
        format: "alpha_num",
      },
      code: {
        title: "Code",
        type: "text",
      },
    });
  },
});
