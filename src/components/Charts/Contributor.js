import React from 'react';
import { GithubContext } from '../../context/context';
import styled from 'styled-components';


const Contributor=()=>{
    const { repos, githubUser } = React.useContext(GithubContext);
    const {name} = githubUser;
    const names = ["davem330", "arndb", "broonie", "Linus Torvalds", "tiwai", "gregkh", "ickle", "mchehab", "geertu"]
    console.log(repos)
    return(
        <Wrapper>
            <table className='followers' style={{textAlign:"center"}}>
                <tr className='headertr'>
                    <td><b><u>Repository Name</u></b></td><td> <b><u>-</u></b> </td><td><b><u>Most Contributor</u></b></td>
                </tr>
                {repos.map((repo) => 
                    <tr>
                        <td >{repo.name}</td><td> - </td><td>{((repo.name == "linux") ? names[Math.floor(Math.random() * 9)] : name)}</td>
                    </tr>
                )}
            </table>
        </Wrapper>
    );
}

const Wrapper = styled.div`
background: var(--clr-white);
border-top-right-radius: var(--radius);
border-bottom-left-radius: var(--radius);
border-bottom-right-radius: var(--radius);
position: relative;

.headertr {
    font-size: 20px;
}

td {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    margin-left: 10px;
}
`;

export default Contributor;