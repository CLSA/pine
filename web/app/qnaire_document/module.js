cenozoApp.defineModule({
  name: "qnaire_document",
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
        singular: "document",
        plural: "documents",
        possessive: "document's",
      },
      columnList: {
        name: { title: "Name" },
      },
      defaultOrder: {
        column: "qnaire_document.name",
        reverse: false,
      },
    });

    module.addInputGroup("", {
      name: {
        title: "Name",
        type: "string",
        format: "identifier",
      },
      data: {
        title: "PDF File",
        type: "base64",
        mimeType: "application/pdf",
      },
    });

    /* ############################################################################################## */
    cenozo.providers.factory("CnQnaireDocumentModelFactory", [
      "CnBaseModelFactory",
      "CnQnaireDocumentAddFactory",
      "CnQnaireDocumentListFactory",
      "CnQnaireDocumentViewFactory",
      "CnHttpFactory",
      "CnModalMessageFactory",
      function (
        CnBaseModelFactory,
        CnQnaireDocumentAddFactory,
        CnQnaireDocumentListFactory,
        CnQnaireDocumentViewFactory,
        CnHttpFactory,
        CnModalMessageFactory
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          angular.extend(this, {
            addModel: CnQnaireDocumentAddFactory.instance(this),
            listModel: CnQnaireDocumentListFactory.instance(this),
            viewModel: CnQnaireDocumentViewFactory.instance(this, root),

            // override transitionToViewState (used when interviewer views a document)
            transitionToViewState: async function (record) {
              if (this.isRole("interviewer")) {
                var modal = CnModalMessageFactory.instance({
                  title: "Please Wait",
                  message:
                    "Please wait while the document is retrieved.",
                  block: true,
                });
                modal.show();

                // get the document's data and download it
                const response = await CnHttpFactory.instance({
                  path: 'qnaire_document/' + record.id,
                  data: { select: { column: 'data' } }
                }).get();
                const data = response.data.data;
                const blob = cenozo.convertBase64ToBlob(data.data, "application/pdf");

                modal.close();
                window.open(window.URL.createObjectURL(blob));
              } else {
                await this.$$transitionToViewState(record);
              }
            },
          });
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
