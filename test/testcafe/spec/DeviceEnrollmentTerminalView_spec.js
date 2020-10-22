import { RequestLogger, RequestMock } from 'testcafe';
import DeviceEnrollmentTerminalPageObject from '../framework/page-objects/DeviceEnrollmentTerminalPageObject';
import IOSOdaEnrollment from '../../../playground/mocks/data/idp/idx/oda-enrollment-ios';
import AndroidOdaEnrollment from '../../../playground/mocks/data/idp/idx/oda-enrollment-android';
import MdmEnrollment from '../../../playground/mocks/data/idp/idx/mdm-enrollment';

const logger = RequestLogger(/introspect/);

const iosOdaMock = RequestMock()
  .onRequestTo('http://localhost:3000/idp/idx/introspect')
  .respond(IOSOdaEnrollment);
const androidOdaMock = RequestMock()
  .onRequestTo('http://localhost:3000/idp/idx/introspect')
  .respond(AndroidOdaEnrollment);
const mdmMock = RequestMock()
  .onRequestTo('http://localhost:3000/idp/idx/introspect')
  .respond(MdmEnrollment);

fixture('Device enrollment terminal view for ODA and MDM');

async function setup(t) {
  const deviceEnrollmentTerminalPageObject = new DeviceEnrollmentTerminalPageObject(t);
  await deviceEnrollmentTerminalPageObject.navigateToPage();
  return deviceEnrollmentTerminalPageObject;
}

test
  .requestHooks(logger, iosOdaMock)('shows the correct content in iOS ODA terminal view', async t => {
    const deviceEnrollmentTerminalPage = await setup(t);
    await t.expect(deviceEnrollmentTerminalPage.getHeader()).eql('Download Okta Verify');
    await t.expect(deviceEnrollmentTerminalPage.getBeaconClass()).contains('mfa-okta-verify');
    const content = deviceEnrollmentTerminalPage.getContentText();
    await t.expect(content).contains('To sign in using Okta Verify, you');
    await t.expect(content).contains('ll need to set up Okta Verify on this device. Download the Okta Verify app from App Store.');
    await t.expect(content).contains('In the app, follow the instructions to add an organizational account.');
    await t.expect(content).contains('When prompted, choose Sign In, then enter the sign-in URL:');
    await t.expect(content).contains('https://idx.okta1.com');
    await t.expect(deviceEnrollmentTerminalPage.getAppStoreLink()).eql('https://apps.apple.com/us/app/okta-verify/id490179405');
    await t.expect(deviceEnrollmentTerminalPage.getAppStoreLogo()).contains('ios-app-store-logo');
  });

test
  .requestHooks(logger, androidOdaMock)('shows the correct content in Android ODA terminal view', async t => {
    const deviceEnrollmentTerminalPage = await setup(t);
    await t.expect(deviceEnrollmentTerminalPage.getHeader()).eql('Download Okta Verify');
    await t.expect(deviceEnrollmentTerminalPage.getBeaconClass()).contains('mfa-okta-verify');
    const content = deviceEnrollmentTerminalPage.getContentText();
    await t.expect(content).contains('To sign in using Okta Verify, you');
    await t.expect(content).contains('ll need to set up Okta Verify on this device. Download the Okta Verify app from Google Play Store.');
    await t.expect(content).contains('In the app, follow the instructions to add an organizational account.');
    await t.expect(content).contains('When prompted, choose Sign In, then enter the sign-in URL:');
    await t.expect(content).contains('https://idx.okta1.com');
    await t.expect(deviceEnrollmentTerminalPage.getAppStoreLink()).eql('https://play.google.com/store/apps/details?id=com.okta.android.auth');
    await t.expect(deviceEnrollmentTerminalPage.getAppStoreLogo()).contains('android-app-store-logo');
  });

test
  .requestHooks(logger, mdmMock)('shows the correct content in MDM terminal view', async t => {
    const deviceEnrollmentTerminalPage = await setup(t);
    await t.expect(deviceEnrollmentTerminalPage.getHeader()).eql('Additional setup required');
    const content = deviceEnrollmentTerminalPage.getContentText();
    await t.expect(content).contains('To access this app, your device needs to meet your organization');
    await t.expect(content).contains('s security requirements. Follow the instructions below to continue.');
    await t.expect(content).contains('Tap the Copy Link button below.');
    await t.expect(content).contains('On this device, open your browser, then paste the copied link into the address bar.');
    await t.expect(content).contains('Follow the instructions in your browser to set up Airwatch, then try accessing this app again');
    await t.expect(deviceEnrollmentTerminalPage.getCopyButtonLabel()).eql('Copy link to clipboard');
    await t.expect(deviceEnrollmentTerminalPage.getCopiedValue()).eql('https://sampleEnrollmentlink.com');
  });
