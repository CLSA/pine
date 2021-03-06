cenozoApp.defineModule({
  name: "reminder",
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
        singular: "reminder",
        plural: "reminders",
        possessive: "reminder's",
      },
      columnList: {
        offset: {
          title: "Offset",
          column: "reminder.offset",
        },
        unit: { title: "Unit" },
      },
      defaultOrder: {
        column: "reminder.id",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      offset: {
        title: "Offset",
        type: "string",
        format: "integer",
      },
      unit: {
        title: "Unit",
        type: "enum",
      },
    });
  },
});
