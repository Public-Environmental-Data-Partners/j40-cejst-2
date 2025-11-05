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
 * Shows both languages side by side with the active one highlighted
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
          // Return null if no languages are found
          if (!languages || languages.length === 0) {
            return null;
          }

          return (
            <div className={styles.languageLinks}>
              {languages.map((lang: string) => {
                const isActive = lang === currentLocale;

                if (isActive) {
                  // Show active language as non-clickable text
                  return (
                    <span key={lang} className={styles.languageLinkActive}>
                      {languageName[lang]}
                    </span>
                  );
                } else {
                  // Show inactive language as clickable link
                  return (
                    <a
                      key={lang}
                      href="#"
                      className={
                        styles.languageLink ?
                          `usa-link ${styles.languageLink}` :
                          `usa-link`
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        changeLocale(lang);
                      }}
                    >
                      {languageName[lang]}
                    </a>
                  );
                }
              })}
            </div>
          );
        }}
      </IntlContextConsumer>
    </div>
  );
};

export default Language;
