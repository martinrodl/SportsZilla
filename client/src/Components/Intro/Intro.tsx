import React from 'react';
import styles from './Intro.module.scss';

import ButtonGeneric from '../ButtonGeneric/ButtonGeneric';
import Map from '../Map/Map';

const Intro: React.FC = () => (
  <div className={styles.Intro} data-testid="Intro">
    <div className={styles.Intro_Title}>
      <h1>Find Your Next Teammates Test</h1>
    </div>
    <div>
      <ButtonGeneric buttonText="Find Events" buttonLink="/board/" />
      <ButtonGeneric buttonText="Join Now" buttonLink="/user/login/" />
    </div>
    <div className={styles.container}>
      <div className={styles.mapContainer}>
        <Map />
      </div>
    </div>
  </div>
);

export default Intro;
