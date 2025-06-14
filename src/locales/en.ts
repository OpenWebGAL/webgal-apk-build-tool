import { Translations } from './i18n'

const en: Translations = {
  title: 'WebGAL APK Build Tool',
  project_path: 'Project Path',
  select: 'Select',
  app_name: 'App Name',
  package_name: 'Package Name',
  package_name_info:
    'Package name can only contain lowercase letters, numbers, underscores (_), or dots (.), starting with a lowercase letter. Must contain at least one dot (.), and dots (.) cannot be at the beginning or end.',
  version_name: 'Version Name',
  version_code: 'Version Code',
  version_code_info:
    'Version code must be an integer greater than 0. After installing a new version of the app, you cannot directly overwrite it with an older version; if you need to use a lower version, you must first uninstall the currently installed higher version.',
  keystore_file_path: 'Keystore File Path',
  new: 'New',
  keystore_password: 'Keystore File Password',
  keystore_password_info: 'Password must be at least 6 characters long.',
  key_alias: 'Key Alias',
  key_password: 'Key Password',
  build_apk: 'Build APK',
  open_output_folder: 'Open Output Folder',

  create_keystore_dialog_title: 'New Keystore File',
  validity_years: 'Validity (Years)',
  first_and_last_name: 'First and Last Name',
  organizational_unit: 'Organizational Unit',
  organization: 'Organization',
  city_or_locality: 'City or Locality',
  state_or_province: 'State or Province',
  country_code: 'Country Code',
  create: 'Create',
  cancel: 'Cancel',
  required_field: '*',
  saved_to: 'Saved to',
  error_opening_folder: 'Error opening folder',

  initializing: 'Initializing',
  checking_project_info: 'Checking project info',
  project_info_not_found: 'Project info not found',
  app_name_not_found: 'App name not found',
  package_name_invalid: 'Package name is invalid',
  package_name_not_found: 'Package name not found',
  version_name_not_found: 'Version name not found',
  version_code_error: 'Version code error',
  keystore_info_missing_skip_signing: 'Keystore info missing, skip signing',
  preparing: 'Preparing',
  apkeditor_not_found: 'APKEditor not found',
  webgal_template_not_found: 'WebGAL template not found',
  jdk_not_found: 'JDK not found',
  build_tools_not_found: 'Build tools not found',
  cleaning_build_dir: 'Cleaning build directory',
  decompiling_template_apk: 'Decompiling template APK',
  apk_decompilation_failed: 'APK decompilation failed',
  replacing_assets: 'Replacing assets',
  copying_engine: 'Copying engine',
  copying_game_assets: 'Copying game assets',
  copying_icons: 'Copying icons',
  skip_copying_icons: 'Skip copying icons',
  replacing_assets_failed: 'Replacing assets failed',
  building_apk: 'Building APK',
  build_apk_failed: 'Build APK failed',
  aligning_apk: 'Aligning APK',
  apk_alignment_failed: 'APK alignment failed',
  signing_apk: 'Signing APK',
  apk_signing_failed_check_info:
    'APK signing failed, please check if the signing information is correct.',
  completed: 'Completed'
}

export default en
