import Container from '@mui/material/Container';
import AppBar from '../../components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
import { mockData } from '~/apis/mock-data';
import { useEffect, useState } from 'react';
import { createNewColumnAPI, createNewCardAPI, fetchBoardDetailsAPI } from '~/apis';

function Board() {
    const [board, setBoard] = useState(null);

    useEffect(() => {
        const boardId = '68de177d7983423e3a65654e';
        // call API
        fetchBoardDetailsAPI(boardId).then((board) => {
            setBoard(board);
        });
    }, []);

    // Gọi API tạo mới Column và làm lại dữ liệu state board
    const createNewColumn = async (newColumnData) => {
        const createdColumn = await createNewColumnAPI({
            ...newColumnData,
            boardId: board._id,
        });

        // Update state board
        const newBoard = { ...board };
        newBoard.columns.push(createdColumn);
        newBoard.columnOrderIds.push(createdColumn._id);
        setBoard(newBoard);
    };

    // Gọi API tạo mới Card và làm lại dữ liệu state board
    const createNewCard = async (newCardData) => {
        const createdCard = await createNewCardAPI({
            ...newCardData,
            boardId: board._id,
        });

        const newBoard = { ...board };
        const columnToUpdate = newBoard.columns.find((column) => column._id === createdCard.columnId);
        if (columnToUpdate) {
            columnToUpdate.cards.push(createdCard);
            columnToUpdate.cardOrderIds.push(createdCard._id);
        }
        setBoard(newBoard);
    };

    return (
        <Container disableGutters maxWidth sx={{ height: '100vh' }}>
            <AppBar />
            <BoardBar board={board} />
            <BoardContent board={board} createNewColumn={createNewColumn} createNewCard={createNewCard} />
        </Container>
    );
}

export default Board;
