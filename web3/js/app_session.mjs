const { CN_base_app_session } = await import(`${CENOZO_URL}/js/base_app_session.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

class app_session extends CN_base_app_session {
  /**
   * Extend parent method
   */
  async start() {
    await super.start();

    // we must force the respondent module's root status for page rendering
    CN_session.get_module("respondent").set_root(true);
  }
}

// Now create the app_session singleton and export it
const CN_app_session = new app_session();
export { CN_app_session };
