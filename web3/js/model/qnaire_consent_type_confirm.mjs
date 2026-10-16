const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_qnaire_consent_type_confirm extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "consent confirm",
        plural: "consent confirms",
        posessive: "consent confirm's",
      },
      columns: {
        consent_type: { title: "Consent Type", column: "consent_type.name" },
      },
      properties: {
        consent_type_id: {
          title: "Consent Type",
          type: "enum",
          enum: {
            path: "consent_type",
          },
        },
      },
    });
  }
}
