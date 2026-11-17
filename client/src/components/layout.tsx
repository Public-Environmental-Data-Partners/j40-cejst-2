import React, {ReactNode} from 'react';
import {Helmet} from 'react-helmet';

import {URLFlagProvider} from '../contexts/FlagContext';

import J40Header from './J40Header';
import J40Footer from './J40Footer';

interface ILayoutProps {
  children: ReactNode,
  location: Location,
  title: string,
}

const Layout = ({children, location, title}: ILayoutProps) => {
  // @ts-ignore
  return (
    <>
      <Helmet defer={false}>
        <html lang="en"/>
        <title>{`${title} - Climate & Economic Justice Screening Tool`}</title>

        {/* Description content should ideally be between 160 - 200 characters */}
        <meta
          name="description"
          // eslint-disable-next-line max-len
          content={`This screening tool identifies disadvantaged communities that are underserved &overburdened by pollution. It provides socioeconomic, environmental, health and climate info to inform decisions.`}
        />

        {/* Keyword content should list the top 10 words in order of relevance. The words chosen need
            to appear on every page. These words were chosen from the header as it appears on each page */}
        <meta
          name="keywords"
          content={`screening tool climate environmental economic justice beta council quality methodology`}
        />

        {/* Allows for Open Graph meta tags */}
        <meta property="og:url" content="https://screeningtool.geoplatform.gov"/>
        <meta property="og:title" content="Climate and Economic Justice Screening Tool"/>
        <meta property="og:site_name" content="Climate and Economic Justice Screening Tool"/>
        <meta
          property="og:description"
          // eslint-disable-next-line max-len
          content={`This screening tool identifies disadvantaged communities that are underserved &overburdened by pollution. It provides socioeconomic, environmental, health and climate info to inform decisions.`}
        />


        {/*
          PostHog page analytics for production only.
          Hostname gate keeps local/CI/PR previews out of the PEDP project.
          Autocapture/replay/surveys/exceptions stay off so we only collect pageviews.
        */}
        <script async type="text/javascript">
          {/* eslint-disable-next-line max-len */}
          { `!function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="Th Mh Eh Ah Oh init dd vd rd ad md mc hd yd ed xd $d Cd Td Id Md capture getExtension fd mr ld ud calculateEventProperties Ad register register_once register_for_session unregister unregister_for_session Dd sd Pd getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys onActiveMatchingSurveysChanged renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync Ld identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset Nd shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty Od wd createPersonProfile setInternalOrTestUser Fd Nh Dh opt_in_capturing opt_out_capturing Lh has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing bd debug yc Ls getPageViewId captureTraceFeedback captureTraceMetric Zh".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
          if (location.href.startsWith('https://public-environmental-data-partners.github.io/j40-cejst-2')) {
            posthog.init('phc_uqi6pCvaCTqoztpU7gN3KRSW5PLCz7K4ufTfj67YBBww', {
                api_host: 'https://us.i.posthog.com',
                defaults: '2026-05-30',
                person_profiles: 'identified_only',
                autocapture: false,
                disable_session_recording: true,
                disable_surveys: true,
                capture_exceptions: false,
            });
          }` }
        </script>
      </Helmet>

      <URLFlagProvider location={location}>
        <J40Header location={location}/>
        <main id={'main-content'}>
          {children}
        </main>
        <J40Footer/>
      </URLFlagProvider>
    </>
  );
};

export default Layout;
