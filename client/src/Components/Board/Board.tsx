import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { useQuery, gql } from '@apollo/client';
import { EventData } from './Event';
import styles from './Board.module.scss';
import EventLogin from '../EventLogin/EventLogin';
import Data from '../../mockData/data.json';
import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import { HashLink as Link } from 'react-router-hash-link';
import Map from '../Map/Map';

interface PropTypes {
  allEvents: Dispatch<SetStateAction<EventData[]>>;
}

const EVENTS = gql`
  query {
    getAllEvents {
      ID
      sportEventName
      sportName
      time
      date
      indoor
      availableSpots
    }
  }
`;

const Board: React.FC<PropTypes> = ({ allEvents }) => {
  interface Response {
    getAllEvents: EventData[];
  }

  const { loading, data, error } = useQuery<Response>(EVENTS);

  type EventBS = {
    id: number;
    sport_id: number;
    sport_name: string;
    location: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
    date: string;
    description: string;
    organizer: number;
    filter: {
      target_gender: string;
      target_level: string;
    };
    time_start: string;
    time_end: string;
    registered_participants: number[];
    max_participants: number;
    min_participants: number;
  };

  const [event, setEvent] = useState<EventBS[]>(Data.events);

  const [eventFilter, setEventFilter] = useState<Event[]>();

  const list = event.map((event, i) => {
    return (
      <div key={`${event.id} ${event.sport_name}`}>
        <EventLogin event={event} />
      </div>
    );
  });

  const filterBySport = (sport: any) => {
    const filteredList = Data.events.filter((e) => {
      return e.sport_name === sport;
    });
    setEvent([...filteredList]);
  };

  const arrowIcon = require('../../Images/FormIcons/down-arrow.svg');
  const arrowIconUp = require('../../Images/FormIcons/up-arrow.svg');

  if (loading) return <Loader boxHeight={400} />;
  if (error) return <div>Oopsie: {error.message}</div>;
  if (data && data.getAllEvents) {
    allEvents(data.getAllEvents);
  }

  return (
    <div className={styles.Container}>
      <div id="list" className={styles.Container1}>
        <SearchBar filterBySport={filterBySport} />
        <div className={styles.Board} data-testid="Board">
          {list}
        </div>
        <div className={styles.Button}>
          <Link smooth to="/Board/#map">
            <button>
              <p>Map View</p>
              <img src={arrowIcon} alt="down-arrow" />
            </button>
          </Link>
        </div>
      </div>
      <div id="map" className={styles.Map}>
        <div className={styles.Map}>
          <div className={styles.Map_arrow}>
            <Link smooth to="/Board/#list">
              <p>Back to List</p>
              <img src={arrowIconUp} alt="down-arrow" />
            </Link>
          </div>
          <Map />
        </div>
      </div>
    </div>
  );
};

export default Board;
