cenozoApp.defineModule({
  name: "embedded_file",
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
        singular: "embedded file",
        plural: "embedded files",
        possessive: "embedded file's",
      },
      columnList: {
        name: {
          title: "Name",
          column: "embedded_file.name",
        },
        mime_type: {
          title: "Mime Type",
        },
        size: {
          title: "Size",
          type: "size",
        },
      },
      defaultOrder: {
        column: "embedded_file.name",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      name: {
        title: "Name",
        type: "string",
        format: "alpha_num",
      },
      mime_type: {
        title: "Mime Type",
        type: "string",
        isExcluded: "add",
        isConstant: true,
      },
      size: {
        title: "File Size",
        type: "size",
        isExcluded: "add",
        isConstant: true,
      },
      data: {
        title: "Content",
        type: "base64",
        getFilename: function ($state, model) {
          let name = model.viewModel.record.name;
          if (model.viewModel.record.mime_type) {
            let extension = model.viewModel.record.mime_type.match( /[a-zA-Z0-9]+$/ );
            if (angular.isArray(extension)) name += ("." + extension[0]);
          }
          return name;
        }
      },
    });
  },
});
