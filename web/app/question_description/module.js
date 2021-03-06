cenozoApp.defineModule({
  name: "question_description",
  models: ["list", "view"],
  create: (module) => {
    cenozoApp.initDescriptionModule(module, "question");

    /* ############################################################################################## */
    cenozo.providers.factory("CnQuestionDescriptionViewFactory", [
      "CnBaseViewFactory",
      "CnBaseDescriptionViewFactory",
      function (CnBaseViewFactory, CnBaseDescriptionViewFactory) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(this, parentModel, root);
          CnBaseDescriptionViewFactory.construct(this, "question");
        };
        return {
          instance: function (parentModel, root) {
            return new object(parentModel, root);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnQuestionDescriptionModelFactory", [
      "CnBaseModelFactory",
      "CnQuestionDescriptionListFactory",
      "CnQuestionDescriptionViewFactory",
      function (
        CnBaseModelFactory,
        CnQuestionDescriptionListFactory,
        CnQuestionDescriptionViewFactory
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.listModel = CnQuestionDescriptionListFactory.instance(this);
          this.viewModel = CnQuestionDescriptionViewFactory.instance(
            this,
            root
          );
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
