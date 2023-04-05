import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Chip,
    Tooltip,
    Button
} from "@mui/material";

import { InitialsAvatar } from "../../components";
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useContext } from "react";

/**
 * @param {string} groupObj - group object
 */
export const GroupCard = (groupObj, ...props) => {
    const [group, setGroup] = useState({});

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/groups/search/byID/' + groupObj["id"]["_id"], {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                setGroup(data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [groupObj]);

    return (
        <Card sx={{ mt: 2, mb: 2 }} {...props}>
            <CardContent>
                <Typography variant="h3" gutterBottom>{group["name"]}</Typography>
                <Typography variant="gray">Members:</Typography>
                <Stack direction="row" spacing={1}>
                    {
                        group["people"].map((member) => {
                            return (
                                <Tooltip
                                    key={member.utorid}
                                    title={member.email}
                                >
                                    <Chip
                                        avatar={<InitialsAvatar name={member.name} />}
                                        label={member.name}
                                        variant="outlined"
                                        onClick={() => {
                                            // copy email to clipboard
                                            navigator.clipboard.writeText(member.email);
                                            console.log("Copied " + member.email + " to clipboard");
                                        }}
                                    />
                                </Tooltip>
                            )
                        })
                    }
                </Stack>
            </CardContent>
            <CardActions>
                <Button href={"/group/" + group["_id"]}>View</Button>
            </CardActions>
        </Card>
    );
}
