import React from "react";
import Header from '../Header.jsx';
import TreeDraw from '../TreeDraw.jsx';
import Card from '../Card.jsx';
import Footer from "../Footer.jsx"
import {clone} from "lodash"
import {find} from "lodash"
import {findIndex} from "lodash"
import {remove} from "lodash"
import CopyToClipboard from "../CopyToClipboard.jsx"

class ChoicesView extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    if (this.props.leftCard == null || this.props.rightCard == null) {
      return (<div><span>Loading...</span></div>);
    }
    return (
      <div id="second_div">
        <div className="container__choose-card">
          <div className="container__top-bar">
            <div className="choose-card__heading">Select the highest priority card</div>
            <div className="container__prioritization-status">
              <div className={"progressive-bar__status-structure"}>
                <div className={"progressive-bar__status"} role="progressbar" aria-valuenow={this.props.progress}
                     aria-valuemin="0"
                     aria-valuemax="100" style={{width: this.props.progress + '%'}}>
                </div>
              </div>
            </div>
          </div>
          <Card id="left_button" side="node" handleClick={this.props.handleCardClicked}
                forget={this.props.handleAddToBlacklist} data={this.props.leftCard.value}
                voters={this.props.everyBodyVoted ? this.props.leftVoters : []}
                continueButton={this.props.leftContinueButton}/>
          <Card id="right_button" side="compareNode" handleClick={this.props.handleCardClicked}
                forget={this.props.handleAddToBlacklist} data={this.props.rightCard.value}
                voters={this.props.everyBodyVoted ? this.props.rightVoters : []}
                continueButton={this.props.rightContinueButton}/>
          {/*<TreeDraw tree={this.state.rootNode}></TreeDraw>*/}
          <button onClick={() => this.props.handleUndoClicked()} id="undo_button" className="normalize__undo-button">
            <div className="undo__button">
              <div className="undo__icon">
                <img src="assets/icons/undo-icon.svg" alt=""/>
                Undo choice
              </div>
            </div>
          </button>
        </div>
        <div className={"footer"}>
          <Footer/>
          <Header/>
        </div>
        {this.props.newRoomButton}
        {this.props.roomLink}
        {this.props.roomVoters.map((item, index) => (
          <img className={'card__voter'} key={index} src={item.avatar}/>
        ))}
      </div>
    )
  }
}

export default ChoicesView