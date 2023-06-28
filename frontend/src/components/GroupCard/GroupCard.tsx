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

import { InitialsAvatar } from "..";
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useContext } from "react";
import { defaultUser } from "../../contexts/UserContext";
import { SnackbarContext } from "../../contexts/SnackbarContext";

interface GroupCardProps {
    /** group object */
    groupObj: FetchedGroup;
}

/**
 * A card that displays information about a group
 * @param {FetchedGroup} groupObj - group object
 */
export const GroupCard = ({groupObj, ...props}: GroupCardProps) => {
    return (
        <Card sx={{ mt: 2, mb: 2 }} {...props}>
            <CardContent>
                <Typography variant="h3" gutterBottom>{groupObj.name}</Typography>
                <Typography variant="gray">Members:</Typography>
                <Stack direction="row" spacing={1}>
                    {
                        groupObj.members.map((member) => {
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
                <Button href={"/group/" + groupObj.id}>View</Button>
            </CardActions>
        </Card>
    );
}
