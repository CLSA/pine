cenozoApp.defineModule({
  name: "response_device",
  models: ["list"],
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "device",
          column: "device.id",
        },
      },
      name: {
        singular: "response device status",
        plural: "response device statuses",
        possessive: "response device status's",
      },
      columnList: {
        questionnaire: {
          title: 'Questionnaire',
          column: 'qnaire.name',
        },
        token: {
          title: 'Token',
          column: 'respondent.token',
        },
        device: {
          title: 'Device',
          column: 'device.name',
        },
        uuid: {
          title: 'UUID',
        },
        status: {
          title: 'Status',
        },
        start_datetime: {
          title: 'Start Date & Time',
          type: 'datetime',
        },
        end_datetime: {
          title: 'End Date & Time',
          type: 'datetime',
        },
      },
      defaultOrder: {
        column: "response_device.start_datetime",
        reverse: true,
      },
    });
  },
});