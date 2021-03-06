cenozoApp.defineModule({
  name: "response_attribute",
  models: ["list", "view"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "response",
          column: "response.id",
        },
      },
      name: {
        singular: "attribute",
        plural: "attributes",
        possessive: "attribute's",
      },
      columnList: {
        name: {
          column: "attribute.name",
          title: "Name",
        },
        value: {
          title: "Value",
        },
      },
      defaultOrder: {
        column: "attribute.name",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      name: {
        column: "attribute.name",
        title: "Name",
        type: "string",
        isConstant: true,
      },
      value: {
        title: "Value",
        type: "string",
      },
    });
  },
});
