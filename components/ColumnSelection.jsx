import React from "react"
import {find} from "lodash"
import Header from './Header.jsx';
import BoardSelector from './BoardSelector.jsx'
import ListSelector from './ListSelector.jsx'
import LabelSelector from './LabelSelector.jsx'
import queryString from "query-string";
import Footer from "./Footer.jsx"

class ColumnSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boards: [],
            lists: [],
            labels: [],
            groupedboards: [],
            organizations: [],
            fromExtension: false,
            boardId: null
        }
        this.getBoardColumns = this.getBoardColumns.bind(this);
        this.retrieveCardsByListId = this.retrieveCardsByListId.bind(this);
        /* this.retrieveCardsGithub = this.retrieveCardsGithub.bind(this);*/
        this.handleBoardClicked = this.handleBoardClicked.bind(this);
        this.handleListClicked = this.handleListClicked.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.labelSelected = this.labelSelected.bind(this);
        this.getBoards = this.getBoards.bind(this);
    }

    componentDidMount() {
        let component = this
        let BoardApi = this.props.BoardApi

        if (component.props.fromExtension !== undefined) {
            if (component.props.fromExtension !== "Github") {
                BoardApi.getCardById(component.props.extId, null, function (card) {
                    component.retrieveCardsByListId(card.idList)
                })
            } else {
                component.retrieveCardsByListId(component.props.extId)
            }
        }

        if (this.state.organizations.length > 0) {
            return;
        }
        this.getBoards()
    }

    getBoards() {
        let component = this
        let BoardApi = this.props.BoardApi
        BoardApi.getMembers('me', {
            organizations: "all",
            organization_fields: "all",
            boards: "open",
            board_lists: "open"
        }, function (data) {
            let boardGroups = [];
            let boards = data.boards;
            let organizations = data.organizations;
            for (let i = 0; i < boards.length; i++) {
                let organization = find(organizations, {'id': boards[i].idOrganization});
                let groupName = "Other";
                if (organization !== undefined) {
                    groupName = organization.displayName;
                }
                if (!boardGroups[groupName]) {
                    boardGroups[groupName] = [];
                }
                boardGroups[groupName].push(boards[i]);
            }
            component.setState({
                boards: boards,
                groupedboards: boardGroups,
                organizations: organizations
            })

        }, function (e) {
            console.log(e);
        });
    }

    labelSelected(labelId) {
        let listCards = this.state.listCards;
        if (labelId !== 0) {
            let label = find(this.state.labels, {'id': labelId});
            listCards = _.filter(this.state.listCards, function (card) {
                return find(card.labels, {'id': label.id}) !== undefined;
            });
        }
        this.props.handleCards(listCards, this.state.boardId);
    }

    retrieveCardsByListId(listId) {
        let that = this;
        let labels = [];
        let BoardApi = this.props.BoardApi
        BoardApi.getCardsByListId(listId, {cards: "open"}, function (data) {
            let listCards = data;
            that.setState({
                listCards: listCards
            });
            listCards.forEach(function (card) {
                card.labels.forEach(function (label) {
                    if (find(labels, {'id': label.id}) === undefined) {
                        labels.push(label);
                    }
                });
            })
            that.setState({
                labels: labels,
                boardId: data.idBoard
            }, function () {
                if (this.state.labels.length === 0) {
                    that.labelSelected(0)
                }
            });
        }, function (e) {
            console.log(e);
        });
    }

    getBoardColumns(board) {
        this.setState({
            lists: board.lists
        });
    }

    handleBoardClicked(boardId) {
        this.setState({
            boardId: boardId
        })

        let board = find(this.state.boards, {'id': boardId});
        this.getBoardColumns(board)
    }

    handleListClicked(listId) {
        let list = find(this.state.lists, {'id': listId});
        this.retrieveCardsByListId(list.id);
    }

    renderBoardSelector() {
        if (this.props.fromExtension !== null) {
            return ""
        }
        return <BoardSelector groupedboards={this.state.groupedboards}
                              onChange={this.handleBoardClicked}/>
    }

    renderListSelector() {
        if (this.state.lists.length === 0 || this.props.fromExtension !== null) {
            return ""
        }
        return <p><ListSelector lists={this.state.lists}
                                onChange={this.handleListClicked}/></p>
    }

    renderLabelSelector() {
        if (this.state.labels.length === 0) {
            return ""
        }
        return <LabelSelector labels={this.state.labels} onClick={this.labelSelected}/>
    }

    render() {
        return (
            <div id="card_url_div">
                <div className="selection__wrapper">
                    <div className="selection__container selection__container--animation">
                        <div className="select-list--text-container selection__heading">
                            {
                                (this.props.fromExtension === true) ?
                                    "Filter by label, or select All" :
                                    "First of all, select the board you want to prioritize"
                            }
                        </div>
                        {this.renderBoardSelector()}
                        {this.renderListSelector()}
                        {this.renderLabelSelector()}
                    </div>
                    <div className={"footer footer--animated"}>
                        <Footer/>
                        <Header/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ColumnSelection
