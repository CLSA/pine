define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'question_option_description', true ); } catch( err ) { console.warn( err ); return; }

  cenozoApp.initDescriptionQuestionOption( module, 'question_option' );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnQuestionOptionDescriptionList', [
    'CnQuestionOptionDescriptionModelFactory',
    function( CnQuestionOptionDescriptionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnQuestionOptionDescriptionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnQuestionOptionDescriptionView', [
    'CnQuestionOptionDescriptionModelFactory',
    function( CnQuestionOptionDescriptionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnQuestionOptionDescriptionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnQuestionOptionDescriptionListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnQuestionOptionDescriptionViewFactory', [
    'CnBaseViewFactory', 'CnBaseDescriptionViewFactory',
    function( CnBaseViewFactory, CnBaseDescriptionViewFactory ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );
        CnBaseDescriptionViewFactory.construct( this, 'question_option' );
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnQuestionOptionDescriptionModelFactory', [
    'CnBaseModelFactory', 'CnQuestionOptionDescriptionListFactory', 'CnQuestionOptionDescriptionViewFactory',
    function( CnBaseModelFactory, CnQuestionOptionDescriptionListFactory, CnQuestionOptionDescriptionViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnQuestionOptionDescriptionListFactory.instance( this );
        this.viewModel = CnQuestionOptionDescriptionViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
