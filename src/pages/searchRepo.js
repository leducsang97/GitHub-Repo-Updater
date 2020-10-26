import { Octokit } from '@octokit/core';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import { TextField, makeStyles, Snackbar, SnackbarContent, IconButton, Button, Paper } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { SearchDisplay } from './searchDisplay';
import { useRepoActions } from '../store';

const octokit = new Octokit();

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		height: '100%'
	},
	searchBox: {
		[theme.breakpoints.down('sm')]: {
			flexDirection: 'column'
		},
		[theme.breakpoints.up('sm')]: {
			flexDirection: 'row'
		},
		display: 'flex',
		width: '100%',
		justifyContent: 'center'
	},
	textfield: {
		margin: '8px'
	},
	body: {
		width: '100%'
	},
	snackbar: {
		borderRadius: '50px',
		backgroundColor: '#f50057',
		alignContent: 'center',
		justifyContent: 'center'
	},
	searchBar: {
		[theme.breakpoints.down('sm')]: {
			display: 'flex'
		}
	},
	buttonGroup: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
}));

export const SearchRepo = () => {
	const [result, setResult] = useState([]);
	const [repo, setRepo] = useState('');
	const [owner, setOwner] = useState('');
	const [error, setError] = useState('');
	const [openSnackbar, setOpenSnackBar] = useState(false);
	const classes = useStyles();
	const newChange = useSelector(state => state.newChange);
	const dispatch = useDispatch();
	const repoActions = useRepoActions();

	function getRepoDetail(repo, owner) {
		return new Promise(function (resolve, reject) {
			octokit
				.request('GET /repos/{owner}/{repo}/releases', {
					owner: owner,
					repo: repo
				})
				.then(response => {
					let repoData = { ...response.data[0], repo: repo, owner: owner, seen: false };
					resolve(repoData);
				})
				.catch(error => {
					setOpenSnackBar(true);
					console.log(error);
					setError('Repo not found');
				});
		});
	}
	const searchRepo = () => {
		getRepoDetail(repo, owner).then(repoData => {
			setResult(repoData);
		});
	};
	const clearSearch = () => {
		setResult({});
	};
	const confirmAdd = () => {
		console.log('Add this to watch list');
		let localSavedRepo = JSON.parse(localStorage.getItem('LocalSavedRepo')) || {};
		let nameOfRepo = repo + '/' + owner;
		//no existing data or new update => update localStorage
		if (!localSavedRepo[nameOfRepo] || localSavedRepo[nameOfRepo].id !== result.id) {
			localSavedRepo[nameOfRepo] = result;
			localStorage.setItem('LocalSavedRepo', JSON.stringify(localSavedRepo));
		} else {
			setOpenSnackBar(true);
			setError('This repo is already in the watching list.');
			console.log('This repo is already in the watching list.');
		}
		dispatch(repoActions.setChange(!newChange));
	};

	const getReloadRepo = async _ => {
		console.log('Reload all existed repos');
		let localSavedRepo = JSON.parse(localStorage.getItem('LocalSavedRepo')) || {};
		for (let repoName in localSavedRepo) {
			const repoData = await getRepoDetail(localSavedRepo[repoName].repo, localSavedRepo[repoName].owner);
			if (repoData.id !== localSavedRepo[repoName].id) {
				localSavedRepo[repoName] = repoData;
				localStorage.setItem('LocalSavedRepo', JSON.stringify(localSavedRepo));
			}
		}
		dispatch(repoActions.setChange(!newChange));
	};
	//For the snackbar
	function handleClose(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnackBar(false);
	}

	return (
		<div className={classes.root}>
			{/* Search tab */}
			<Paper className={classes.searchBox}>
				<div className={classes.searchBar}>
					<TextField
						id="standard-multiline-flexible"
						label="Repo"
						rowsMax={4}
						classes={{ root: classes.textfield }}
						value={repo}
						onChange={event => setRepo(event.target.value)}
					/>
					<TextField
						id="standard-multiline-flexible"
						label="Owner"
						rowsMax={4}
						classes={{ root: classes.textfield }}
						value={owner}
						onChange={event => setOwner(event.target.value)}
					/>
				</div>
				<div className={classes.buttonGroup}>
					<Button onClick={searchRepo}>Search</Button>
					<Button onClick={clearSearch}>Clear</Button>
					<Button onClick={getReloadRepo}>Reload</Button>
				</div>
			</Paper>
			{/* Result tab */}
			<div className={classes.body}>
				{Object.keys(result).length !== 0 && (
					<SearchDisplay data={result} buttonAction={confirmAdd} buttonName={'Add to Watch List'} />
				)}
			</div>

			{/* Display Error */}
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right'
				}}
				open={openSnackbar}
				autoHideDuration={2000}
				onClose={handleClose}
				ContentProps={{
					'aria-describedby': 'copied-hashtags-message'
				}}
				action={[
					<IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				]}>
				<SnackbarContent
					className={classes.snackbar}
					message={
						<span id="client-snackbar" className={classes.message}>
							{error}
						</span>
					}
				/>
			</Snackbar>
		</div>
	);
};

export default React.memo(SearchRepo);
