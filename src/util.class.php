<?php
/**
 * util.class.php
 */

namespace pine;
use cenozo\lib, cenozo\log;

/**
 * util: utility class of static methods
 *
 * Extends cenozo's util class with additional functionality.
 */
class util extends \cenozo\util
{
  /**
   * Used by the respondent and response service modules to prepare their select and modifier objects
   * @param database\select $select
   * @param database\modifier $modifier
   */
  public static function prepare_respondent_read_objects( $select, $modifier )
  {
    if( $select->has_column( 'page_progress' ) )
    {
      $select->add_column(
        'CONCAT( '.
          'IF( '.
            'response.submitted, '.
            'qnaire.total_pages, '.
            'IF( response.page_id IS NULL, 0, response.current_page_rank ) '.
          '), '.
          '" of ", qnaire.total_pages '.
        ')',
        'page_progress',
        false
      );
    }

    if( $select->has_column( 'introduction_list' ) )
    {
      // join to the introduction descriptions
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'qnaire.id', '=', 'introduction.qnaire_id', false );
      $join_mod->where( 'introduction.type', '=', 'introduction' );
      $modifier->join_modifier( 'qnaire_description', $join_mod, '', 'introduction' );
      $modifier->join(
        'language',
        'introduction.language_id',
        'introduction_language.id',
        '',
        'introduction_language'
      );
      $select->add_column(
        'GROUP_CONCAT( '.
          'DISTINCT CONCAT_WS( "`", introduction_language.code, IFNULL( introduction.value, "" ) ) '.
          'SEPARATOR "`" '.
        ')',
        'introduction_list',
        false
      );

      if( !$modifier->has_group( 'qnaire.id' ) ) $modifier->group( 'qnaire.id' );
    }

    if( $select->has_column( 'conclusion_list' ) )
    {
      // join to the conclusion descriptions
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'qnaire.id', '=', 'conclusion.qnaire_id', false );
      $join_mod->where( 'conclusion.type', '=', 'conclusion' );
      $modifier->join_modifier( 'qnaire_description', $join_mod, '', 'conclusion' );
      $modifier->join( 'language', 'conclusion.language_id', 'conclusion_language.id', '', 'conclusion_language' );
      $select->add_column(
        'GROUP_CONCAT( '.
          'DISTINCT CONCAT_WS( "`", conclusion_language.code, IFNULL( conclusion.value, "" ) ) '.
          'SEPARATOR "`" '.
        ')',
        'conclusion_list',
        false
      );

      if( !$modifier->has_group( 'qnaire.id' ) ) $modifier->group( 'qnaire.id' );
    }

    if( $select->has_column( 'closed_list' ) )
    {
      // join to the closed descriptions
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'qnaire.id', '=', 'closed.qnaire_id', false );
      $join_mod->where( 'closed.type', '=', 'closed' );
      $modifier->join_modifier( 'qnaire_description', $join_mod, '', 'closed' );
      $modifier->join( 'language', 'closed.language_id', 'closed_language.id', '', 'closed_language' );
      $select->add_column(
        'GROUP_CONCAT( '.
          'DISTINCT CONCAT_WS( "`", closed_language.code, IFNULL( closed.value, "" ) ) '.
          'SEPARATOR "`" '.
        ')',
        'closed_list',
        false
      );

      if( !$modifier->has_group( 'qnaire.id' ) ) $modifier->group( 'qnaire.id' );
    }

    if( $select->has_column( 'problem_prompt_list' ) )
    {
      // join to the problem_prompt descriptions
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'qnaire.id', '=', 'problem_prompt.qnaire_id', false );
      $join_mod->where( 'problem_prompt.type', '=', 'problem prompt' );
      $modifier->join_modifier( 'qnaire_description', $join_mod, '', 'problem_prompt' );
      $modifier->join(
        'language',
        'problem_prompt.language_id',
        'problem_prompt_language.id',
        '',
        'problem_prompt_language'
      );
      $select->add_column(
        'GROUP_CONCAT( '.
          'DISTINCT CONCAT_WS( "`", problem_prompt_language.code, IFNULL( problem_prompt.value, "" ) ) '.
          'SEPARATOR "`" '.
        ')',
        'problem_prompt_list',
        false
      );

      if( !$modifier->has_group( 'qnaire.id' ) ) $modifier->group( 'qnaire.id' );
    }

    if( $select->has_column( 'problem_confirm_list' ) )
    {
      // join to the problem_confirm descriptions
      $join_mod = lib::create( 'database\modifier' );
      $join_mod->where( 'qnaire.id', '=', 'problem_confirm.qnaire_id', false );
      $join_mod->where( 'problem_confirm.type', '=', 'problem confirm' );
      $modifier->join_modifier( 'qnaire_description', $join_mod, '', 'problem_confirm' );
      $modifier->join(
        'language',
        'problem_confirm.language_id',
        'problem_confirm_language.id',
        '',
        'problem_confirm_language'
      );
      $select->add_column(
        'GROUP_CONCAT( '.
          'DISTINCT CONCAT_WS( "`", problem_confirm_language.code, IFNULL( problem_confirm.value, "" ) ) '.
          'SEPARATOR "`" '.
        ')',
        'problem_confirm_list',
        false
      );

      if( !$modifier->has_group( 'qnaire.id' ) ) $modifier->group( 'qnaire.id' );
    }

    if( $select->has_column( 'phone_list' ) )
    {
      // join to the phone table
      $modifier->left_join( 'phone', 'participant.id', 'phone.participant_id' );
      $select->add_column(
        'GROUP_CONCAT( '.
          'DISTINCT CONCAT_WS( ":", phone.type, phone.number ) '.
          'ORDER BY phone.rank '.
          'SEPARATOR "`" '.
        ')',
        'phone_list',
        false
      );

      if( !$modifier->has_group( 'qnaire.id' ) ) $modifier->group( 'qnaire.id' );
    }
  }

  /**
   * Returns a curl object used by detached instances
   * @param string $url The url to connect to
   * @return cURL handle
   */
  public static function get_detached_curl_object( $url )
  {
    $setting_manager = lib::create( 'business\setting_manager' );

    $curl = curl_init();
    curl_setopt( $curl, CURLOPT_URL, $url );
    curl_setopt( $curl, CURLOPT_SSL_VERIFYPEER, false );
    curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $curl, CURLOPT_CONNECTTIMEOUT, 5 );
    curl_setopt(
      $curl,
      CURLOPT_HTTPHEADER,
      [
        sprintf(
          'Authorization: Basic %s',
          base64_encode(
            sprintf(
              '%s:%s',
              $setting_manager->get_setting( 'general', 'machine_username' ),
              $setting_manager->get_setting( 'general', 'machine_password' )
            )
          )
        )
      ]
    );

    return $curl;
  }

  /**
   * Utility function used to download data from the parent instance
   * @param string $subject The subject to download (study, consent_type, etc...)
   * @param string $url_postfix A string to add to the end of the remote URL (after api/<subject>)
   * @return $object (decoded json response from remote server)
   */
  public static function get_data_from_parent( $subject, $url_postfix = '' )
  {
    $setting_manager = lib::create( 'business\setting_manager' );
    if( !$setting_manager->get_setting( 'general', 'detached' ) || is_null( PARENT_INSTANCE_URL ) ) return NULL;

    // get subject data from the parent
    $url = sprintf(
      '%s/api/%s%s',
      PARENT_INSTANCE_URL,
      $subject,
      util::full_urlencode( $url_postfix )
    );
    $curl = static::get_detached_curl_object( $url );

    $response = curl_exec( $curl );
    if( curl_errno( $curl ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Got error code %s when synchronizing %s data with parent instance.'."\n".
          'URL: "%s"'."\n".
          'Message: %s',
          curl_errno( $curl ),
          $subject,
          $url,
          curl_error( $curl )
        ),
        __METHOD__
      );
    }

    $code = curl_getinfo( $curl, CURLINFO_HTTP_CODE );
    if( 401 == $code )
    {
      throw lib::create( 'exception\notice',
        'Unable to synchronize, invalid Beartooth username and/or password.',
        __METHOD__
      );
    }

    if( 306 == $code )
    {
      throw lib::create( 'exception\notice',
        sprintf(
          "Parent Pine instance responded with the following notice\n\n\"%s\"",
          util::json_decode( $response )
        ),
        __METHOD__
      );
    }

    if( 204 == $code || 300 <= $code )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Got error code %s when synchronizing %s data with parent instance.'."\n".
          'URL: "%s"',
          $code,
          $subject,
          $url
        ),
        __METHOD__
      );
    }

    return util::json_decode( $response );
  }
}
