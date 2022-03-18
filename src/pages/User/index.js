import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';
import {
  Container,
  DataUser,
  Name,
  Bio,
  Avatar,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      users: '',
      stars: [],
      page: 1,
      loading: false,
      refreshing: false,
    };
  }
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  async componentDidMount() {
    this.handleStoreAndLoadMore();
  }

  /*loadStars = async () => {
    if (this.state.loading) return;
    const { page, stars } = this.state;
    this.setState({ loading: true });
    const response = await api.get(
      `/users/${user.login}/starred?q=&page=${page}`
    );
  };*/

  handleStoreAndLoadMore = async () => {
    const user = this.props.navigation.getParam('user');
    const { page, stars } = this.state;
    console.tron.log(page);

    const response = await api.get(
      `/users/${user.login}/starred?q=&page=${page}`
    );
    if (page > 1) {
      this.setState({
        loading: true,
      });
    }

    if (response.data.length > 0) {
      this.setState({
        page: this.state.page + 1,
        users: user,
        stars: [...stars, ...response.data],
        loading: false,
        refreshing: false,
      });
    } else {
      return null;
    }
  };

  refreshList = () => {
    this.setState(
      { refreshing: true, stars: [], page: 1 },
      this.handleStoreAndLoadMore
    );
  };

  handleNavigate = (repository) => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  renderFooter = () => {
    const { loading, page } = this.state;
    if (loading & (page !== 1)) {
      return null;
    }
    return <Loading />;
  };

  render() {
    const { users, stars, loading, page, refreshing } = this.state;

    return (
      <Container>
        <DataUser>
          <Avatar source={{ uri: users.avatar }} />
          <Name>{users.name}</Name>
          <Bio>{users.bio}</Bio>
        </DataUser>

        {loading & (page === 1) ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Stars
            data={stars}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            keyExtractor={(star) => String(star.id)} // The return must be a string
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
            onEndReached={this.handleStoreAndLoadMore}
            onEndThreshold={0.2}
            ListFooterComponent={this.renderFooter}
          />
        )}
      </Container>
    );
  }
}
