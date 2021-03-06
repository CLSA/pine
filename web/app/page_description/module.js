cenozoApp.defineModule({
  name: "page_description",
  models: ["list", "view"],
  create: (module) => {
    cenozoApp.initDescriptionModule(module, "page");

    /* ############################################################################################## */
    cenozo.providers.factory("CnPageDescriptionViewFactory", [
      "CnBaseViewFactory",
      "CnBaseDescriptionViewFactory",
      function (CnBaseViewFactory, CnBaseDescriptionViewFactory) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);
          CnBaseDescriptionViewFactory.construct(this, "page");
        };
        return {
          instance: function (parentModel, root) {
            return new object(parentModel, root);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnPageDescriptionModelFactory", [
      "CnBaseModelFactory",
      "CnPageDescriptionListFactory",
      "CnPageDescriptionViewFactory",
      function (
        CnBaseModelFactory,
        CnPageDescriptionListFactory,
        CnPageDescriptionViewFactory
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.listModel = CnPageDescriptionListFactory.instance(this);
          this.viewModel = CnPageDescriptionViewFactory.instance(this, root);
          this.getEditEnabled = function () {
            return !this.viewModel.record.readonly && this.$$getEditEnabled();
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
