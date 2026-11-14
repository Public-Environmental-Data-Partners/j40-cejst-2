import {defineMessages, FormattedDate, FormattedMessage} from 'gatsby-plugin-intl';
import React from 'react';
import LinkTypeWrapper from '../../components/LinkTypeWrapper';
import {PAGES_ENDPOINTS} from '../constants';
import {linkFn} from './common';

export const PRIVACY_POLICY_LAST_UPDATED = new Date(2026, 10, 14, 11, 59, 59); // Nov 14 2026
export const PRIVACY_EMAIL = 'CEJST@ceq.eop.gov';
export const USA_GOV_COOKIES_URL = 'https://www.usa.gov/optout-instructions';
export const POSTHOG_PRIVACY_URL = 'https://posthog.com/privacy';
export const COPPA_URL = 'https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa';

export const PAGE_INTRO = defineMessages({
  PAGE_TITLE: {
    id: 'privacy.page.title',
    defaultMessage: 'Privacy Policy',
    description: 'Privacy page title meta info',
  },
  PAGE_HEADING: {
    id: 'privacy.page.heading',
    defaultMessage: 'CEJST Privacy Policy',
    description: 'Main heading for privacy page',
  },
});

export const PRIVACY_CONTENT = {
  EFFECTIVE_DATE: <FormattedMessage
    id={'privacy.effective.date'}
    defaultMessage={'Effective Date: {last_updated}'}
    description={'Privacy policy effective date display'}
    values={{
      last_updated: <FormattedDate
        value={PRIVACY_POLICY_LAST_UPDATED}
        year="numeric"
        month="long"
        day="numeric"
      />,
    }}
  />,
  INTRO: <FormattedMessage
    id={'privacy.intro'}
    defaultMessage={`The Council on Environmental Quality (CEQ, we, or us) is committed to protecting the privacy and
      security of the information we collect from users (you) of the Climate and Economic Justice Screening Tool
      (CEJST), including the interactive map and the other features of the CEJST website. This Privacy Policy
      explains our practices for collecting, using, and disclosing information that we obtain from your use of the
      CEJST.`}
    description={'Privacy policy overall intro'}
  />,
  INFO_COLLECT_HEADING: <FormattedMessage
    id={'privacy.info.collect.heading'}
    defaultMessage={'Information We Collect'}
    description={'Privacy policy information collection heading'}
  />,
  INFO_COLLECT_BODY: <FormattedMessage
    id={'privacy.info.collect.body'}
    defaultMessage={`When you visit the CEJST, we automatically collect certain information about your device, including
      information about your web browser, IP address, time zone, and some of the cookies that are installed on your
      device. (See below for more details about cookies.) Additionally, we may collect information about how you use
      the CEJST tool, including the census tracts you search for and view.`}
    description={'Privacy policy automatic data collection text'}
  />,
  PERSONAL_INFO_HEADING: <FormattedMessage
    id={'privacy.personal.info.heading'}
    defaultMessage={'Personal Information You Voluntarily Provide'}
    description={'Privacy policy voluntary information heading'}
  />,
  PERSONAL_INFO_BODY1: <FormattedMessage
    id={'privacy.personal.info.body1'}
    defaultMessage={`You can voluntarily provide us certain information, such as your email address, if you choose give
      us feedback about the CEJST. You do not have to provide personal information to visit the CEJST. If you choose
      to provide personal information by sending a message to an email address on this website, submitting a form
      through this website, or filling out a questionnaire, we will use the information you provide to respond to you
      or provide the service you requested.`}
    description={'Privacy policy voluntary information text'}
  />,
  PERSONAL_INFO_BODY2: <FormattedMessage
    id={'privacy.personal.info.body2'}
    defaultMessage={`Please do not send us sensitive information, such as social security numbers or financial
      information, through this website or by email.`}
    description={'Privacy policy sensitive information warning'}
  />,
  USE_INFO_HEADING: <FormattedMessage
    id={'privacy.use.info.heading'}
    defaultMessage={'How We Use Your Information'}
    description={'Privacy policy information usage heading'}
  />,
  USE_INFO_BODY1: <FormattedMessage
    id={'privacy.use.info.body1'}
    defaultMessage={'We use the information we collect to:'}
    description={'Privacy policy usage list intro'}
  />,
  USE_INFO_LIST: [
    <FormattedMessage
      id={'privacy.use.info.list.item1'}
      key={'privacy.use.info.list.item1'}
      defaultMessage={'Operate, maintain, and improve the CEJST tool;'}
      description={'Privacy policy usage list item 1'}
    />,
    <FormattedMessage
      id={'privacy.use.info.list.item2'}
      key={'privacy.use.info.list.item2'}
      defaultMessage={'Analyze how the tool is being used to inform future improvements;'}
      description={'Privacy policy usage list item 2'}
    />,
    <FormattedMessage
      id={'privacy.use.info.list.item3'}
      key={'privacy.use.info.list.item3'}
      defaultMessage={`Communicate with you about the tool, if you send us feedback by filling out a form or
        questionnaire; and`}
      description={'Privacy policy usage list item 3'}
    />,
    <FormattedMessage
      id={'privacy.use.info.list.item4'}
      key={'privacy.use.info.list.item4'}
      defaultMessage={'Comply with legal obligations and enforce our policies.'}
      description={'Privacy policy usage list item 4'}
    />,
  ],
  SHARING_INFO_BODY1: <FormattedMessage
    id={'privacy.sharing.info.body1'}
    defaultMessage={`We do not sell or rent your personal information to third parties for their own marketing
      purposes.`}
    description={'Privacy policy data brokering text'}
  />,
  SHARING_INFO_BODY2: <FormattedMessage
    id={'privacy.sharing.info.body2'}
    defaultMessage={`In some cases, we may share information you have provided or automatically generated information
      with other government agencies in response to a lawful request from law enforcement, to protect the website
      from security threats, or as otherwise required by law.`}
    description={'Privacy policy government sharing text'}
  />,
  SHARING_INFO_BODY3: <FormattedMessage
    id={'privacy.sharing.info.body3'}
    defaultMessage={`We may share your information with third-party service providers who assist us in operating the
      CEJST tool, including PostHog, which we use to measure website traffic. PostHog\u2019s practices are described
      in its <posthog>privacy policy</posthog>.`}
    description={'Privacy policy third-party sharing text'}
    values={{
      posthog: linkFn(POSTHOG_PRIVACY_URL, false, true),
    }}
  />,
  COOKIES_HEADING: <FormattedMessage
    id={'privacy.cookies.heading'}
    defaultMessage={`Information Collected for Website Measurement and Customization Technologies (Cookies)`}
    description={'Privacy policy cookies heading'}
  />,
  COOKIES_BODY1: <FormattedMessage
    id={'privacy.cookies.body1'}
    defaultMessage={`A cookie is a small file that a website you visit transfers to your computer to allow it to
      remember specific information about your visit.`}
    description={'Privacy policy cookie definition'}
  />,
  COOKIES_BODY2: <FormattedMessage
    id={'privacy.cookies.body2'}
    defaultMessage={`The CEJST uses cookies and similar technologies for technical purposes, such as to enable better
      navigation through the site or to allow you to customize your preferences for interacting with the website.
      We also use PostHog, a third-party analytics service, to monitor page traffic. PostHog may store cookies or
      local storage values on your device for that purpose.`}
    description={'Privacy policy CEJST cookie usage'}
  />,
  COOKIES_BODY3: <FormattedMessage
    id={'privacy.cookies.body3'}
    defaultMessage={`<link1>USA.gov</link1> provides instructions for "opting out" from many website cookies. Those
      instructions may not stop PostHog analytics on this site. You can also limit tracking through your browser
      settings or by using tools that block third-party analytics scripts.`}
    description={'Privacy policy cookie opt-out info'}
    values={{
      link1: linkFn(USA_GOV_COOKIES_URL, false, true),
    }}
  />,
  EXTERNAL_LINKS_HEADING: <FormattedMessage
    id={'privacy.external.links.heading'}
    defaultMessage={'Links to External Sites'}
    description={'Privacy policy external links heading'}
  />,
  EXTERNAL_LINKS_BODY: <FormattedMessage
    id={'privacy.external.links.body'}
    defaultMessage={`The CEJST includes links to other federal agencies\u2019 and non-federal organizations\u2019
      websites. If you access another website through a link that we provide, that website\u2019s privacy policy
      applies to your interaction with that website, instead of this privacy policy.`}
    description={'Privacy policy external links text'}
  />,
  CHILDREN_HEADING: <FormattedMessage
    id={'privacy.children.heading'}
    defaultMessage={'Children\u2019s Online Privacy'}
    description={'Privacy policy children\'s privacy heading'}
  />,
  CHILDREN_BODY: <FormattedMessage
    id={'privacy.children.body'}
    defaultMessage={`We believe in the importance of protecting the privacy of children online. The
      <coppa>Children\u2019s Online Privacy Protection Act (COPPA)</coppa> governs information gathered online from or
      about children under the age of 13. A website must obtain verifiable consent from a child\u2019s parent or
      guardian before collecting, using, or disclosing personal information from a child under age 13. Our site is not
      intended to solicit information of any kind from children under age 13. If you believe that we have received
      information from or about children under age 13, please <contact>contact us</contact>.`}
    description={'Privacy policy children\'s privacy text'}
    values={{
      coppa: linkFn(COPPA_URL, false, true),
      contact: linkFn(PAGES_ENDPOINTS.CONTACT, true, false),
    }}
  />,
  SECURITY_HEADING: <FormattedMessage
    id={'privacy.security.heading'}
    defaultMessage={'Data Security'}
    description={'Privacy policy security heading'}
  />,
  SECURITY_BODY: <FormattedMessage
    id={'privacy.security.body'}
    defaultMessage={`We implement reasonable security measures to help protect the security of your information.
      However, no system can be completely secure, so we cannot guarantee the absolute security of information you
      provide or of information you access from the CEJST.`}
    description={'Privacy policy security measures text'}
  />,
  CONTACT_HEADING: <FormattedMessage
    id={'privacy.contact.heading'}
    defaultMessage={'Contact Us'}
    description={'Privacy policy contact heading'}
  />,
  CONTACT_BODY: <FormattedMessage
    id={'privacy.contact.body'}
    defaultMessage={`If you have any questions or concerns about our privacy practices, please contact us at
      {privacy_email}`}
    description={'Privacy policy contact information'}
    values={{
      privacy_email: (
        <LinkTypeWrapper
          linkText={PRIVACY_EMAIL}
          internal={false}
          url={`mailto:${PRIVACY_EMAIL}`}
          openUrlNewTab={true}
        />
      ),
    }}
  />,
};
