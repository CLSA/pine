define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'module_description', true ); } catch( err ) { console.warn( err ); return; }

  cenozoApp.initDescriptionModule( module, 'module' );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnModuleDescriptionList', [
    'CnModuleDescriptionModelFactory',
    function( CnModuleDescriptionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnModuleDescriptionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnModuleDescriptionView', [
    'CnModuleDescriptionModelFactory',
    function( CnModuleDescriptionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnModuleDescriptionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnModuleDescriptionListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnModuleDescriptionViewFactory', [
    'CnBaseViewFactory', 'CnBaseDescriptionViewFactory',
    function( CnBaseViewFactory, CnBaseDescriptionViewFactory ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root );
        CnBaseDescriptionViewFactory.construct( this, 'module' );
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnModuleDescriptionModelFactory', [
    'CnBaseModelFactory', 'CnModuleDescriptionListFactory', 'CnModuleDescriptionViewFactory',
    function( CnBaseModelFactory, CnModuleDescriptionListFactory, CnModuleDescriptionViewFactory ) {
      var object = function( root ) {
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnModuleDescriptionListFactory.instance( this );
        this.viewModel = CnModuleDescriptionViewFactory.instance( this, root );
        this.getEditEnabled = function() { return !this.viewModel.record.readonly && this.$$getEditEnabled(); };
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
