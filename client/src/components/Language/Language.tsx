import React from 'react';
import {IntlContextConsumer, changeLocale} from 'gatsby-plugin-intl';

// @ts-ignore
import languageIcon from '/node_modules/uswds/dist/img/usa-icons/language.svg';
import * as styles from './Language.module.scss';

const languageName: { [key: string]: string } = {
  en: 'English',
  es: 'Español',
};

interface ILanguageProps {
  isDesktop: boolean;
}

/**
 * Language component that will allow the user to change languages
 *
 * @param {boolean} isDesktop
 * @return {JSX.Element | null}
 */
const Language = ({isDesktop}: ILanguageProps): JSX.Element | null => {
  return (
    <div
      className={
        isDesktop ? styles.languageContainer : styles.languageContainerMobile
      }
    >
      <img
        className={styles.languageIcon}
        src={languageIcon}
        alt={'language icon for selecting language'}
      />
      <IntlContextConsumer>
        {({languages, language: currentLocale}) => {
          // Find the alternative language (the one that's not currently active)
          const alternativeLanguage = languages.find(
              (lang: string) => lang !== currentLocale,
          );

          // Return null if no alternative language is found
          if (!alternativeLanguage) {
            return null;
          }

          return (
            <a
              href="#"
              className={
                styles.languageLink ?
                  `usa-link ${styles.languageLink}` :
                  `usa-link`
              }
              onClick={() => changeLocale(alternativeLanguage)}
            >
              {languageName[alternativeLanguage]}
            </a>
          );
        }}
      </IntlContextConsumer>
    </div>
  );
};

export default Language;
