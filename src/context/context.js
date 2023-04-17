import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

// Provider, Consumer - GithubContext.Provider

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  // request loading
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // error
  const [error, setError] = useState({ show: false, msg: '' });

  const searchGithubUser = async (user) => {
    
    var users = user.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
    console.log(users)
    var userdata = [0, 0];
    var userinfo = [];
    var repoinfo = [];
    var followerinfo = [];
    var followerlen = [0, 0];
    for(let iter=0; iter<2; iter++) {
      toggleError();
      setIsLoading(true);
      const response = await axios(`${rootUrl}/users/${users[iter]}`).catch((err) =>
        console.log(err)
      );
      if (response) {
        var temp = JSON.stringify(response)
        setGithubUser(response.data);
        userinfo[iter] = response.data;
        const { login, followers_url } = response.data;

        await Promise.allSettled([
          axios(`${rootUrl}/users/${login}/repos?per_page=100`),
          axios(`${followers_url}?per_page=100`),
        ])
          .then((results) => {
            const [repos, followers] = results;
            const status = 'fulfilled';
            if (repos.status === status) {
              userdata[iter] += repos.value.data.length;
              repoinfo[iter] = repos.value.data;
              setRepos(repos.value.data);
            }
            if (followers.status === status) {
              followerinfo[iter] = followers.value.data;
              followerlen[iter] += followers.value.data.length;
              setFollowers(followers.value.data);
            }
          })
          .catch((err) => console.log(err));
      } else {
        toggleError(true, 'there is no user with that username');
      }
      checkRequests();
      setIsLoading(false);
    }

    if(userdata[0] + followerlen[0] > userdata[1] + followerlen[1]){
      console.log(userinfo[0])
      setGithubUser(userinfo[0]);
      setRepos(repoinfo[0]);
      setFollowers(followerinfo[0]);
    }
    else {
      console.log(userinfo[1]);
      setGithubUser(userinfo[1]);
      setRepos(repoinfo[1]);
      setFollowers(followerinfo[1]);
    }
  };

  //  check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(true, 'sorry, you have exceeded your hourly rate limit!');
        }
      })
      .catch((err) => console.log(err));
  };
  function toggleError(show = false, msg = '') {
    setError({ show, msg });
  }
  // error
  useEffect(checkRequests, []);
  // get initial user
  useEffect(() => {
    searchGithubUser('torvalds');

  }, []);
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
