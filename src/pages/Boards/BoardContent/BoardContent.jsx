import Box from '@mui/material/Box';
import ListColumns from './ListComlumns/ListColumns';
import { mapOrder } from '~/utils/sorts';

import {
    DndContext,
    // MouseSensor,
    // TouchSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    closestCorners,
    pointerWithin,
    rectIntersection,
    getFirstCollision,
    closestCenter,
} from '@dnd-kit/core';
import { MouseSensor, TouchSensor } from '../../../../customLibraries/DndKitSensors';

import { arrayMove } from '@dnd-kit/sortable';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cloneDeep, isEmpty } from 'lodash';
import { generatePlaceholderCard } from '~/utils/formatter';

import Column from './ListComlumns/Column/Column';
import Card from './ListComlumns/Column/ListCards/Card/Card';

const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
    CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
};
function BoardContent({ board, createNewColumn, createNewCard }) {
    // Yeu cau chuot di chuyen 10px thi moi goi event, fix truong hop click bi goi event
    const mouserSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });

    // Nhan giu 250ms va dung sai cua cam ung 500px thi moi kich hoat event
    const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } });

    // const mySensors = useSensors(pointerSensor);
    // Uu tien su dung ket hop 2 loai sensor la mouse va touch de co trai nghiem tren mobile tot nhat, khong bi bug
    const mySensors = useSensors(mouserSensor, touchSensor);

    const [oderedColumns, setOderedColumns] = useState([]);

    // Cung mot thoi diem chi co mot phan tu dang duoc keo(Column hoac Card)
    const [activeDragItemId, setActiveDragItemId] = useState(null);
    const [activeDragItemType, setActiveDragItemType] = useState(null);
    const [activeDragItemData, setActiveDragItemData] = useState(null);
    const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null);

    // Diem va cham cuoi cung truoc do
    const lastOverId = useRef(null);

    useEffect(() => {
        setOderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
    }, [board]);

    // Funct chung xu ly viec Cap nhat lai state trong truong hop di chuyen Card giua cac Column khac nhau
    const moveCardBetweenDifferentColumns = (
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDragingCardId,
        activeDragingCardData,
    ) => {
        setOderedColumns((prevColumns) => {
            // Tìm vị trí(index) của overCard trong Column đích (nơi ma activeCard sắp được thả)
            const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId);

            // Logic tính toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện
            let newCardIndex;
            const isBelowOverItem =
                active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
            const modifier = isBelowOverItem ? 1 : 0;
            newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;

            //Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
            const nextColumns = cloneDeep(prevColumns);
            const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id);
            const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id);

            if (nextActiveColumn) {
                nextActiveColumn.cards = nextActiveColumn.cards.filter((card) => card._id !== activeDragingCardId);

                // Them Placeholder Card neu Column rong
                if (isEmpty(nextActiveColumn.cards)) {
                    nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
                }

                // Cap nhat lai mang cardOrderIds cho chuan du lieu
                nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card) => card._id);
            }
            if (nextOverColumn) {
                nextOverColumn.cards = nextOverColumn.cards.filter((card) => card._id !== activeDragingCardId);

                // Phai cap nhat lai chuan du lieu ColumnId trong card sau khi keo tha card giua 2 column khac nhau
                const rebuild_activeDraggingCardData = {
                    ...activeDragingCardData,
                    columnId: nextOverColumn._id,
                };
                nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData);

                // Xoa Placeholder Card neu dang ton tai
                nextOverColumn.cards = nextOverColumn.cards.filter((card) => !card.FE_PlaceholderCard);

                nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id);
            }

            return nextColumns;
        });
    };

    const handleDragStart = (e) => {
        // console.log('handleDragStart: ', e);
        setActiveDragItemId(e?.active?.id);
        setActiveDragItemType(
            e?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN,
        );
        setActiveDragItemData(e?.active?.data?.current);

        // Nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
        if (e?.active?.data?.current?.columnId) {
            setOldColumnWhenDraggingCard(findColumnByCardId(e?.active?.id));
        }
    };

    const findColumnByCardId = (cardId) => {
        return oderedColumns.find((column) => column?.cards?.map((card) => card._id)?.includes(cardId));
    };

    // Trigger trong qua trinh keo  phan tu
    const handleDragOver = (e) => {
        // Neu dang keo Column thi return
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

        // Neu keo card thi xu ly them de co the keo card qua lai giua cac column
        const { active, over } = e;

        //Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì ko làm gì (tránh crash trang)
        if (!active || !over) return;

        // activeDragingCardId: Dang duoc keo
        const {
            id: activeDragingCardId,
            data: { current: activeDragingCardData },
        } = active;
        // overCardId: Card dang tuong tac tren hoac duoi so vs card duoc keo o tren
        const { id: overCardId } = over;

        // Tim 2 column theo CardId
        const activeColumn = findColumnByCardId(activeDragingCardId);
        const overColumn = findColumnByCardId(overCardId);

        if (!activeColumn || !overColumn) return;

        if (activeColumn._id !== overColumn._id) {
            moveCardBetweenDifferentColumns(
                overColumn,
                overCardId,
                active,
                over,
                activeColumn,
                activeDragingCardId,
                activeDragingCardData,
            );
        }
    };

    const handleDragEnd = (e) => {
        // console.log('handleDragEnd: ', e);
        const { active, over } = e;

        // Kiem tra neu ko ton tai over (Keo linh tinh ra ngoai thi return luon tranh loi)
        if (!active || !over) return;

        // Xu ly keo tha Card
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
            // activeDragingCardId: Dang duoc keo
            const {
                id: activeDragingCardId,
                data: { current: activeDragingCardData },
            } = active;
            // overCardId: Card dang tuong tac tren hoac duoi so vs card duoc keo o tren
            const { id: overCardId } = over;

            // Tim 2 column theo CardId
            const activeColumn = findColumnByCardId(activeDragingCardId);
            const overColumn = findColumnByCardId(overCardId);

            if (!activeColumn || !overColumn) return;

            // Phai dùng toi activeDragItemData (set vào state từ bước handleDragStart) chứ không phải activeData trong scope handleDragEnd này Vì sau khi đi qua onDragOver tới đây là state của card đã bị cập nhật một lần rồi.
            if (oldColumnWhenDraggingCard._id !== overColumn._id) {
                moveCardBetweenDifferentColumns(
                    overColumn,
                    overCardId,
                    active,
                    over,
                    activeColumn,
                    activeDragingCardId,
                    activeDragingCardData,
                );
            } else {
                console.log('Hanh dong keo tha card trong cung mot column');

                // Lay vi tri cu (tu thang oldColumnWhenDraggingCard)
                const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex((c) => c._id === activeDragItemId);
                // Lay vi tri moi (tu thang oldColumnWhenDraggingCard)
                const newCardIndex = overColumn?.cards?.findIndex((c) => c._id === overCardId);

                const dndOderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex);

                setOderedColumns((prevColumns) => {
                    // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
                    const nextColumns = cloneDeep(prevColumns);

                    // Tim toi column dang tha
                    const targetColumn = nextColumns.find((column) => column._id === overColumn._id);

                    // Cap nhat lai 2 gtri moi la card va cardOrderIds trong targetColumn
                    targetColumn.cards = dndOderedCards;
                    targetColumn.cardOrderIds = dndOderedCards.map((card) => card._id);
                    return nextColumns;
                });
            }
        }

        // Xu ly keo tha Column
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            if (active.id !== over.id) {
                // Lay vi tri cu (tu thang active)
                const oldColumnIndex = oderedColumns.findIndex((c) => c._id === active.id);
                // Lay vi tri moi (tu thang active)
                const newColumnIndex = oderedColumns.findIndex((c) => c._id === over.id);

                const dndOderedColumns = arrayMove(oderedColumns, oldColumnIndex, newColumnIndex);
                setOderedColumns(dndOderedColumns);
            }
        }

        setActiveDragItemId(null);
        setActiveDragItemType(null);
        setActiveDragItemData(null);
        setOldColumnWhenDraggingCard(null);
    };

    const customDropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.5' } },
        }),
    };

    const collisionDetectionStrategy = useCallback(
        (args) => {
            if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
                return closestCorners({ ...args });
            }

            // Tim cac diem gia nhau, va cham - intersections vs con tro
            const pointerIntersections = pointerWithin(args);
            // console.log(pointerIntersections);
            if (!pointerIntersections?.length) return;

            // Thuat toan phat hien va cham se tra ve mot mang cac va cham o day
            const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection(args);

            // Tim overId dau tien trong dam intersection o tren
            let overId = getFirstCollision(intersections, 'id');

            if (overId) {
                const checkColumn = oderedColumns.find((column) => column._id === overId);
                if (checkColumn) {
                    overId = closestCenter({
                        ...args,
                        droppableContainers: args.droppableContainers.filter((container) => {
                            return container.id != overId && checkColumn?.cardOrderIds?.includes(container.id);
                        }),
                    })[0]?.id;
                }

                lastOverId.current = overId;
                return [{ id: overId }];
            }

            return lastOverId.current ? [{ id: lastOverId.current }] : [];
        },
        [activeDragItemType],
    );
    return (
        <DndContext
            sensors={mySensors}
            // Nếu chỉ dùng closestCornors sẽ có bug flickering + sai lệch dữ liễu
            // collisionDetection={closestCorners}
            collisionDetection={collisionDetectionStrategy}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <Box
                sx={{
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
                    width: '100%',
                    height: (theme) => theme.trello.boardContentHeight,
                    p: '10px 0',
                }}
            >
                <ListColumns createNewColumn={createNewColumn} createNewCard={createNewCard} columns={oderedColumns} />
                <DragOverlay dropAnimation={customDropAnimation}>
                    {!activeDragItemData && null}
                    {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
                    {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
                </DragOverlay>
            </Box>
        </DndContext>
    );
}

export default BoardContent;
