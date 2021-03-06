cenozoApp.defineModule({
  name: "respondent_mail",
  models: "list",
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "respondent",
          column: "respondent.id",
        },
      },
      name: {
        singular: "email",
        plural: "emails",
        possessive: "email's",
      },
      columnList: {
        type: {
          title: "Type",
        },
        rank: {
          title: "Rank",
          type: "rank",
        },
        schedule_datetime: {
          column: "mail.schedule_datetime",
          title: "Scheduled Date & Time",
          type: "datetime",
        },
        sent_datetime: {
          column: "mail.sent_datetime",
          title: "Sent Date & Time",
          type: "datetime",
        },
        sent: {
          column: "mail.sent",
          title: "Sent",
          type: "boolean",
        },
      },
      defaultOrder: {
        column: "rank",
        reverse: false,
      },
    });
  },
});
