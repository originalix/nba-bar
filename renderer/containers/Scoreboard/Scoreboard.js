import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import R from 'ramda';

import Wrapper from '@components/Wrapper';
import Tab from '@components/Tab';
import NavBar from '@components/NavBar';
import { Spinner, Error } from '@components/Loader';
import {
  TeamScore,
  LineScore,
  Stats,
  BoxScore,
  PlayByPlay,
} from '@components/Scoreboard';
import { DataSection } from '@components/shared';
import * as actions from './actions';

const Item = styled.div`
  flex: 1 1 auto;
  width: 100%;
  margin-top: ${props => props.marginTop}px;
`;

const Scoreboard = ({
  fetchData,
  error,
  loading,
  router,
  gameData,
  date,
  gameBoxScoreData,
  gamePlayByPlayData,
}) => {
  useEffect(() => {
    fetchData({
      date,
      gameId: router.query.gameId,
    });
  }, []);

  return (
    <Wrapper currentTab={1}>
      <>
        <NavBar page="SCOREBOARD" />
        <DataSection>
          {loading && <Spinner />}
          {error && <Error />}
          {!error && !loading && (
            <>
              <Item marginTop="0">
                <TeamScore
                  arena={gameData.arena}
                  city={gameData.city}
                  home={{
                    name: gameData.home.abbreviation,
                    score: gameData.home.score,
                  }}
                  visitor={{
                    name: gameData.visitor.abbreviation,
                    score: gameData.visitor.score,
                  }}
                  winner={
                    +gameData.home.score > +gameData.visitor.score
                      ? 'home'
                      : 'visitor'
                  }
                  gameStatus="Final"
                />
              </Item>
              <Item marginTop="20">
                <LineScore
                  home={{
                    name: gameData.home.abbreviation,
                    linescores: gameBoxScoreData.home.linescores.period,
                    score: gameData.home.score,
                  }}
                  visitor={{
                    name: gameData.visitor.abbreviation,
                    linescores: gameBoxScoreData.visitor.linescores.period,
                    score: gameData.visitor.score,
                  }}
                />
              </Item>
              <Item marginTop="20">
                <Tab titles={['STATS', 'PLAY-BY-PLAY', 'BOX SCORE']}>
                  <Stats
                    home={{
                      name: gameData.home.abbreviation,
                      stats: gameBoxScoreData.home.stats,
                    }}
                    visitor={{
                      name: gameData.visitor.abbreviation,
                      stats: gameBoxScoreData.visitor.stats,
                    }}
                  />
                  <PlayByPlay
                    gamePlayByPlayData={R.reverse(gamePlayByPlayData)}
                  />
                  <BoxScore
                    home={{
                      name: gameData.home.abbreviation,
                      players: gameBoxScoreData.home.players.player,
                    }}
                    visitor={{
                      name: gameData.visitor.abbreviation,
                      players: gameBoxScoreData.visitor.players.player,
                    }}
                  />
                </Tab>
              </Item>
            </>
          )}
        </DataSection>
      </>
    </Wrapper>
  );
};

Scoreboard.propTypes = {
  fetchData: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  router: PropTypes.object.isRequired,
  gameData: PropTypes.object.isRequired,
  date: PropTypes.number.isRequired,
  gameBoxScoreData: PropTypes.object.isRequired,
  gamePlayByPlayData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  error: state.scoreboard.error,
  loading: state.scoreboard.loading,
  gameData: R.find(R.propEq('id', ownProps.router.query.gameId))(
    state.home.scheduleData
  ),
  date: state.home.date,
  gameBoxScoreData: state.scoreboard.gameBoxScoreData,
  gamePlayByPlayData: state.scoreboard.gamePlayByPlayData,
});

export default connect(
  mapStateToProps,
  actions
)(Scoreboard);
