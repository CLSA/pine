cenozoApp.extendModule({
  name: "root",
  dependencies: "qnaire",
  create: (module) => {
    var qnaireModule = cenozoApp.module("qnaire");

    // extend the view factory
    cenozo.providers.decorator("cnHomeDirective", [
      "$delegate",
      "$compile",
      "CnSession",
      "CnQnaireModelFactory",
      function ($delegate, $compile, CnSession, CnQnaireModelFactory) {
        var oldController = $delegate[0].controller;
        var oldLink = $delegate[0].link;

        if ("interviewer" == CnSession.role.name) {
          // show interviewers the qnaire list on their home page
          angular.extend($delegate[0], {
            compile: function () {
              return function (scope, element, attrs) {
                if (angular.isFunction(oldLink)) oldLink(scope, element, attrs);
                angular
                  .element(element[0].querySelector(".inner-view-frame div"))
                  .append(
                    '<cn-qnaire-list model="qnaireModel"></cn-qnaire-list>'
                  );
                $compile(element.contents())(scope);
              };
            },
            controller: function ($scope) {
              oldController($scope);
              $scope.qnaireModel = CnQnaireModelFactory.instance();
            },
          });
        }

        return $delegate;
      },
    ]);
  },
});
