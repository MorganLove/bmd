import lodashMerge from 'lodash.merge'
import Mousetrap from 'mousetrap'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { BrowserRouter, Route } from 'react-router-dom'

// Enable to view the event atrributes
// document.addEventListener('keydown', event => {
//   console.log('==============================')
//   console.log('==============================')
//   console.log('==============================')
//   console.log('Event:', event)
//   console.log('Keyboard Event object keys:', {
//     charCode: event.charCode,
//     code: event.code,
//     key: event.key,
//     keyCode: event.keyCode,
//     metaKey: event.metaKey,
//   })
//   console.log('==============================')
//   console.log('==============================')
//   console.log('==============================')
// })

import 'normalize.css'
import './App.css'

import {
  Election,
  ElectionDefaults,
  OptionalElection,
  Vote,
  VotesDict,
} from './config/types'

import electionDefaults from './data/electionDefaults.json'
import electionSample from './data/electionSample.json'

export const mergeWithDefaults = (
  election: Election,
  defaults: ElectionDefaults = electionDefaults
) => lodashMerge(defaults, election)

import Ballot from './components/Ballot'
import Screen from './components/Screen'
import UploadConfig from './components/UploadConfig'
import BallotContext from './contexts/ballotContext'

interface State {
  ballotKey: string
  election: OptionalElection
  votes: VotesDict
}

export const electionKey = 'votingWorksElection'
const removeElectionShortcuts = ['mod+k']

const initialState = {
  ballotKey: '',
  election: undefined,
  votes: {},
}

class App extends React.Component<RouteComponentProps, State> {
  public state: State = initialState

  public componentDidCatch() {
    this.reset()
    window.location.reload()
  }

  public componentDidMount = () => {
    if (window.location.hash === '#sample') {
      this.setState({
        election: mergeWithDefaults(electionSample as Election),
      })
    } else {
      this.setState({
        election: this.getElection(),
      })
    }
    Mousetrap.bind(removeElectionShortcuts, this.reset)
    document.documentElement.setAttribute('data-useragent', navigator.userAgent)
  }

  public componentWillUnount = /* istanbul ignore next */ () => {
    Mousetrap.unbind(removeElectionShortcuts)
  }

  public getElection = () => {
    const election = window.localStorage.getItem(electionKey)
    return election ? JSON.parse(election) : undefined
  }

  public setElection = (electionConfigFile: Election) => {
    const election = mergeWithDefaults(electionConfigFile)
    this.setState({ election })
    window.localStorage.setItem(electionKey, JSON.stringify(election))
  }

  public reset = /* istanbul ignore next */ () => {
    this.setState(initialState)
    window.localStorage.removeItem(electionKey)
    this.props.history.push('/')
  }

  public updateVote = (contestId: string, vote: Vote) => {
    this.setState(prevState => ({
      votes: { ...prevState.votes, [contestId]: vote },
    }))
  }

  public resetBallot = (path: string = '/') => {
    this.setState({ votes: initialState.votes }, () => {
      this.props.history.push(path)
    })
  }

  public setBallotKey = (ballotKey: string) => {
    this.setState({
      ballotKey,
    })
  }

  public render() {
    const { election } = this.state
    if (!election) {
      return <UploadConfig setElection={this.setElection} />
    } else {
      return (
        <BallotContext.Provider
          value={{
            election,
            resetBallot: this.resetBallot,
            setBallotKey: this.setBallotKey,
            updateVote: this.updateVote,
            votes: this.state.votes,
          }}
        >
          <Ballot />
        </BallotContext.Provider>
      )
    }
  }
}

const Root = () => (
  <BrowserRouter>
    <Screen>
      <Route path="/" component={App} />
    </Screen>
  </BrowserRouter>
)

export default Root
