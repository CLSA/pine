define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'requisite', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'requisite_group',
        column: 'requisite_group.id'
      }
    },
    name: {
      singular: 'requisite',
      plural: 'requisites',
      possessive: 'requisite\'s'
    },
    columnList: {
      rank: {
        title: 'Rank',
        type: 'rank'
      },
      logic: {
        title: 'Logic'
      },
      negative: {
        title: 'Negative',
        type: 'boolean'
      },
      operator: {
        title: 'operator'
      },
      value: {
        title: 'value'
      }
    },
    defaultOrder: {
      column: 'rank',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    rank: {
      title: 'Rank',
      type: 'rank'
    },
    logic: {
      title: 'Logic',
      type: 'enum'
    },
    negative: {
      title: 'Negative',
      type: 'boolean' 
    },
    operator: {
      title: 'Operator',
      type: 'enum'
    },
    value: {
      title: 'Value',
      type: 'string'
    },
    note: {
      title: 'Note',
      type: 'text'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnRequisiteAdd', [
    'CnRequisiteModelFactory',
    function( CnRequisiteModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnRequisiteModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnRequisiteList', [
    'CnRequisiteModelFactory',
    function( CnRequisiteModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnRequisiteModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnRequisiteView', [
    'CnRequisiteModelFactory',
    function( CnRequisiteModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnRequisiteModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnRequisiteAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnRequisiteListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnRequisiteViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnRequisiteModelFactory', [
    'CnBaseModelFactory', 'CnRequisiteAddFactory', 'CnRequisiteListFactory', 'CnRequisiteViewFactory',
    function( CnBaseModelFactory, CnRequisiteAddFactory, CnRequisiteListFactory, CnRequisiteViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnRequisiteAddFactory.instance( this );
        this.listModel = CnRequisiteListFactory.instance( this );
        this.viewModel = CnRequisiteViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
