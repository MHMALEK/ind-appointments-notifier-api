enum IND_SERVICES {
  BIOMETRICS = 'bio',
  COLLECT_DOCUMENTS = 'doc',
  RETURN_VISA = 'tkv',
  RESIDENCE_ENDORSEMENT_STICKER = 'vaa',
}

enum IND_SERVICES_LABELS {
  bio = 'Biometrics',
  doc = 'Collect residency documents',
  tkv = 'Return visa',
  vaa = 'Residence endorsment sticker',
}

export { IND_SERVICES_LABELS };
export default IND_SERVICES;
