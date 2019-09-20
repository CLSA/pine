define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'page', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'module',
        column: 'module.id'
      }
    },
    name: {
      singular: 'page',
      plural: 'pages',
      possessive: 'page\'s'
    },
    columnList: {
      rank: {
        title: 'Rank',
        type: 'rank'
      },
      name: {
        title: 'Name'
      },
      description: {
        title: 'Description',
        align: 'left'
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
    name: {
      title: 'Name',
      type: 'string'
    },
    description: {
      title: 'Description',
      type: 'text'
    },
    note: {
      title: 'Note',
      type: 'text'
    },

    module_id: { exclude: true },
    previous_page_id: { exclude: true },
    next_page_id: { exclude: true }
  } );

  module.addExtraOperation( 'view', {
    title: '<i class="glyphicon glyphicon-chevron-left"></i>',
    classes: 'btn-info',
    operation: function( $state, model ) { model.viewModel.viewPreviousPage(); },
    isDisabled: function( $state, model ) { return null == model.viewModel.record.previous_page_id; }
  } );

  module.addExtraOperation( 'view', {
    title: '<i class="glyphicon glyphicon-chevron-right"></i>',
    classes: 'btn-info',
    operation: function( $state, model ) { model.viewModel.viewNextPage(); },
    isDisabled: function( $state, model ) { return null == model.viewModel.record.next_page_id; }
  } );

  module.addExtraOperation( 'view', {
    title: 'Preview',
    operation: function( $state, model ) {
      $state.go(
        'page.render',
        { identifier: model.viewModel.record.getIdentifier() },
        { reload: true }
      );
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnPageAdd', [
    'CnPageModelFactory',
    function( CnPageModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnPageModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnPageList', [
    'CnPageModelFactory',
    function( CnPageModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnPageModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnPageRender', [
    'CnPageModelFactory', '$q', '$document', '$transitions',
    function( CnPageModelFactory, $q, $document, $transitions ) {
      return {
        templateUrl: module.getFileUrl( 'render.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          $scope.isComplete = false;
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnPageModelFactory.root;

          // bind keypresses (first unbind to prevent duplicates)
          $document.unbind( 'keydown.render' );
          $document.bind( 'keydown.render', function( event ) {
            // only send keydown events when on the render page and the key is a numpad number
            if( 'render' == $scope.model.getActionFromState() && 96 <= event.which && event.which <= 105 ) {
              $scope.model.renderModel.onKeydown( event.which - 96 );
              $scope.$apply();
            }
          } );

          $q.all( [
            $scope.model.viewModel.onView(),
            $scope.model.renderModel.onLoad()
          ] ).then( function() {
            $scope.isComplete = true;
          } );
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnPageView', [
    'CnPageModelFactory',
    function( CnPageModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnPageModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPageAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPageListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPageRenderFactory', [
    'CnHttpFactory', '$state', '$document', '$transitions',
    function( CnHttpFactory, $state, $document, $transitions ) {
      var object = function( parentModel ) {
        var self = this;

        function setExclusiveAnswer( questionId, selectedProperty ) {
          // unselect all values other than the selected one
          for( var property in self.data[questionId] ) {
            if( self.data[questionId].hasOwnProperty( property ) ) {
              if( selectedProperty != property && self.data[questionId][property] ) {
                self.data[questionId][property] = angular.isString( self.data[questionId][property] ) ? null : false;
              }
            }
          }
        }

        angular.extend( this, {
          parentModel: parentModel,
          questionList: [],
          data: {},
          keyQuestionIndex: null,
          onLoad: function() {
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '/question'
            } ).query().then( function( response ) {
              self.questionList = response.data;
              self.questionList.forEach( function( question, index ) {
                // all questions may have no answer
                self.data[question.id] = { dkna: false, refuse: false };

                if( 'boolean' == question.type ) {
                  angular.extend( self.data[question.id], { yes: false, no: false } );
                } else if( 'list' == question.type ) {
                  CnHttpFactory.instance( {
                    path: ['question', question.id, 'question_option' ].join( '/' ),
                    data: {
                      select: { column: [ 'name', 'value', 'exclusive', 'extra' ] },
                      modifier: { order: 'question_option.rank' }
                    }
                  } ).query().then( function( response ) {
                    question.optionList = response.data;
                    question.optionList.forEach( function( option ) {
                      self.data[question.id][option.id] = false;
                      if( null != option.extra ) {
                        self.data[question.id]['other' + option.id] = null;
                      }
                    } );
                  } );
                } else if( 'comment' != question.type ) {
                  self.data[question.id].value = null;
                }

                // make sure we have the first non-comment question set as the first key question
                if( null == self.keyQuestionIndex && 'comment' != question.type ) self.keyQuestionIndex = index;
              } );
            } );
          },

          onKeydown: function( key ) {
            // do nothing if we have no key question index (which means the page only has comments)
            if( null == self.keyQuestionIndex ) return;

            var question = self.questionList[self.keyQuestionIndex];

            if( 'boolean' == question.type ) {
              // 1 is yes, 2 is no, 3 is dkna and 4 is refuse
              var answer = 1 == key ? true
                         : 2 == key ? false
                         : 3 == key ? 'dkna'
                         : 4 == key ? 'refuse'
                         : null;

              if( null != answer ) {
                var property = angular.isString( answer ) ? answer : answer ? 'yes' : 'no';
                self.data[question.id][property] = !self.data[question.id][property];
                self.setAnswer( question, answer );
              }
            } else if( 'list' == question.type ) {
              // check if the key is within the option list or the 2 dkna/refuse options
              if( key <= question.optionList.length ) {
                var answer = question.optionList[key-1];
                self.data[question.id][answer.id] = !self.data[question.id][answer.id];
                self.setAnswer( question, answer );
              } else if( key == question.optionList.length + 1 ) {
                self.data[question.id].dkna = !self.data[question.id].dkna;
                self.setAnswer( question, 'dkna' );
              } else if( key == question.optionList.length + 2 ) {
                self.data[question.id].refuse = !self.data[question.id].refuse;
                self.setAnswer( question, 'refuse' );
              }
            } else {
              // 1 is dkna and 2 is refuse
              var answer = 1 == key ? 'dkna'
                         : 2 == key ? 'refuse'
                         : null;

              if( null != answer ) {
                self.data[question.id][answer] = !self.data[question.id][answer];
                self.setAnswer( question, answer );
              }
            }

            // advance to the next non-comment question, looping back to the first when we're at the end of the list
            do {
              self.keyQuestionIndex++;
              if( self.keyQuestionIndex == self.questionList.length ) self.keyQuestionIndex = 0;
            } while( 'comment' == self.questionList[self.keyQuestionIndex].type );
          },

          setAnswer: function( question, value ) {
            if( 'dkna' == value || 'refuse' == value ) {
              if( self.data[question.id][value] ) setExclusiveAnswer( question.id, value );
            } else {
              // handle each question type
              if( 'boolean' == question.type ) {
                // unselect all other values
                for( var property in self.data[question.id] ) {
                  if( self.data[question.id].hasOwnProperty( property ) ) {
                    if( ( value ? 'yes' : 'no' ) != property ) self.data[question.id][property] = false;
                  }
                }
              } else if( 'list' == question.type ) {
                // unselect certain values if we're checking this option
                if( self.data[question.id][value.id] ) {
                  if( value.exclusive ) {
                    setExclusiveAnswer( question.id, value.id );
                  } else {
                    // unselect all no-answer and exclusive values
                    self.data[question.id].dkna = false;
                    self.data[question.id].refuse = false;
                    question.optionList.filter( option => option.exclusive ).forEach( function( option ) {
                      self.data[question.id][option.id] = false;
                    } );
                  }
                }

                // handle the special circumstance when clicking an option with an extra added input
                if( null != value.extra ) {
                  if( self.data[question.id][value.id] ) document.getElementById( 'other' + value.id ).focus();
                  else self.data[question.id]['other' + value.id] = null;
                }
              }
            }
          },

          viewPage: function() {
            $state.go(
              'page.view',
              { identifier: this.parentModel.viewModel.record.getIdentifier() },
              { reload: true }
            );
          },

          renderPreviousPage: function() {
            $state.go(
              'page.render',
              { identifier: this.parentModel.viewModel.record.previous_page_id },
              { reload: true }
            );
          },

          renderNextPage: function() {
            $state.go(
              'page.render',
              { identifier: this.parentModel.viewModel.record.next_page_id },
              { reload: true }
            );
          }
        } );
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPageViewFactory', [
    'CnBaseViewFactory', 'CnHttpFactory', '$state',
    function( CnBaseViewFactory, CnHttpFactory, $state ) {
      var object = function( parentModel, root ) {
        var self = this;
        CnBaseViewFactory.construct( this, parentModel, root );

        angular.extend( this, {
          viewPreviousPage: function() {
            $state.go(
              'page.view',
              { identifier: this.record.previous_page_id },
              { reload: true }
            );
          },
          viewNextPage: function() {
            $state.go(
              'page.view',
              { identifier: this.record.next_page_id },
              { reload: true }
            );
          }
        } );
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnPageModelFactory', [
    'CnBaseModelFactory', 'CnPageAddFactory', 'CnPageListFactory', 'CnPageRenderFactory', 'CnPageViewFactory',
    function( CnBaseModelFactory, CnPageAddFactory, CnPageListFactory, CnPageRenderFactory, CnPageViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnPageAddFactory.instance( this );
        this.listModel = CnPageListFactory.instance( this );
        this.renderModel = CnPageRenderFactory.instance( this );
        this.viewModel = CnPageViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
