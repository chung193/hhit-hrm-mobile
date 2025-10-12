// RPScreen.tsx
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Card, Text, Button, Chip, Divider, Snackbar, Badge, IconButton,
} from 'react-native-paper';

type Choice = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'lose' | 'draw';

const CHOICES: { key: Choice; label: string; emoji: string }[] = [
    { key: 'rock', label: 'Búa', emoji: '✊' },
    { key: 'paper', label: 'Bao', emoji: '✋' },
    { key: 'scissors', label: 'Kéo', emoji: '✌️' },
];

const EMOJI_MAP: Record<Choice, string> = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️',
};

function judge(player: Choice, cpu: Choice): Result {
    if (player === cpu) return 'draw';
    if (
        (player === 'rock' && cpu === 'scissors') ||
        (player === 'paper' && cpu === 'rock') ||
        (player === 'scissors' && cpu === 'paper')
    ) return 'win';
    return 'lose';
}

function randomCPU(): Choice {
    const i = Math.floor(Math.random() * CHOICES.length);
    return CHOICES[i].key;
}

type Round = {
    id: string;
    player: Choice;
    cpu: Choice;
    result: Result;
    at: number;
};

const RPS: React.FC = () => {
    // score
    const [me, setMe] = useState(0);
    const [bot, setBot] = useState(0);
    const [draw, setDraw] = useState(0);

    // last selections
    const [lastPlayer, setLastPlayer] = useState<Choice | null>(null);
    const [lastCPU, setLastCPU] = useState<Choice | null>(null);
    const [lastResult, setLastResult] = useState<Result | null>(null);

    // rounds history (limit 10 for UI)
    const [history, setHistory] = useState<Round[]>([]);

    // ui
    const [thinking, setThinking] = useState(false);
    const [snackbar, setSnackbar] = useState<{ visible: boolean; text: string }>({
        visible: false,
        text: '',
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    const colorForResult = useMemo(() => {
        switch (lastResult) {
            case 'win': return { bg: '#27ae60', text: '#fff', label: 'Thắng 🎉' };
            case 'lose': return { bg: '#c0392b', text: '#fff', label: 'Thua 😭' };
            case 'draw': return { bg: '#d97706', text: '#fff', label: 'Hòa 😐' };
            default: return null;
        }
    }, [lastResult]);

    const onPick = (choice: Choice) => {
        if (thinking) return;
        setThinking(true);
        setLastPlayer(choice);
        // chút delay cho “kịch tính”
        timerRef.current = setTimeout(() => {
            const cpu = randomCPU();
            const r = judge(choice, cpu);

            setLastCPU(cpu);
            setLastResult(r);

            if (r === 'win') setMe((x) => x + 1);
            else if (r === 'lose') setBot((x) => x + 1);
            else setDraw((x) => x + 1);

            const round: Round = {
                id: `${Date.now()}_${Math.random()}`,
                player: choice,
                cpu,
                result: r,
                at: Date.now(),
            };
            setHistory((prev) => [round, ...prev].slice(0, 10));

            setSnackbar({
                visible: true,
                text:
                    r === 'win' ? 'Tuyệt bro! Anh thắng ván này 👑' :
                        r === 'lose' ? 'Ôi… bot ăn rồi, làm ván nữa nào 😤' :
                            'Hòa nha! Lại phát nữa đi 😎',
            });

            setThinking(false);
        }, 450);
    };

    const onReset = () => {
        setMe(0); setBot(0); setDraw(0);
        setLastCPU(null); setLastPlayer(null); setLastResult(null);
        setHistory([]);
    };

    const onUndo = () => {
        const last = history[0];
        if (!last) return;
        if (last.result === 'win') setMe((x) => Math.max(0, x - 1));
        if (last.result === 'lose') setBot((x) => Math.max(0, x - 1));
        if (last.result === 'draw') setDraw((x) => Math.max(0, x - 1));
        setHistory((prev) => prev.slice(1));
        // cập nhật last* về ván mới nhất còn lại
        const next = history[1];
        setLastPlayer(next?.player ?? null);
        setLastCPU(next?.cpu ?? null);
        setLastResult(next?.result ?? null);
    };

    return (
        <View style={styles.container}>
            <Card style={styles.scoreCard}>
                <Card.Content>
                    <View style={styles.scoreRow}>
                        <View style={styles.scoreBox}>
                            <Text variant="labelLarge">Bạn</Text>
                            <Text variant="displaySmall" style={styles.bold}>{me}</Text>
                        </View>
                        <View style={styles.scoreBox}>
                            <Text variant="labelLarge">Hòa</Text>
                            <Text variant="displaySmall" style={styles.bold}>{draw}</Text>
                        </View>
                        <View style={styles.scoreBox}>
                            <Text variant="labelLarge">Bot</Text>
                            <Text variant="displaySmall" style={styles.bold}>{bot}</Text>
                        </View>
                    </View>

                    <Divider style={{ marginVertical: 12 }} />

                    <View style={styles.resultRow}>
                        <View style={styles.pairBox}>
                            <Text variant="labelLarge" style={styles.dim}>Bạn</Text>
                            <Chip mode="outlined" style={styles.bigChip}>
                                <Text style={styles.bigEmoji}>{lastPlayer ? EMOJI_MAP[lastPlayer] : '—'}</Text>
                            </Chip>
                        </View>

                        <View style={styles.pairBox}>
                            <Text variant="labelLarge" style={styles.dim}>Bot</Text>
                            <Chip mode="outlined" style={styles.bigChip}>
                                <Text style={styles.bigEmoji}>{lastCPU ? EMOJI_MAP[lastCPU] : '—'}</Text>
                            </Chip>
                        </View>
                    </View>

                    {colorForResult && (
                        <View style={[styles.banner, { backgroundColor: colorForResult.bg }]}>
                            <Text style={{ color: colorForResult.text, fontWeight: '700' }}>{colorForResult.label}</Text>
                        </View>
                    )}
                </Card.Content>
            </Card>

            <Card style={styles.actionsCard}>
                <Card.Title title="Chọn chiêu" right={() => (
                    <View style={{ flexDirection: 'row' }}>
                        <IconButton icon="undo" onPress={onUndo} disabled={history.length === 0} />
                        <IconButton icon="refresh" onPress={onReset} />
                    </View>
                )} />
                <Card.Content>
                    <View style={styles.choiceRow}>
                        {CHOICES.map(c => (
                            <View key={c.key} style={styles.choiceItem}>
                                <Badge style={styles.badge}>{c.label}</Badge>
                                <Button
                                    mode="contained"
                                    onPress={() => onPick(c.key)}
                                    style={styles.choiceBtn}
                                    contentStyle={{ height: 64 }}
                                    loading={thinking}
                                    disabled={thinking}
                                    testID={`btn-${c.key}`}
                                >
                                    <Text style={styles.choiceEmoji}>{c.emoji}</Text>
                                </Button>
                            </View>
                        ))}
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.historyCard}>
                <Card.Title title={`Lịch sử ván (${history.length})`} />
                <Card.Content>
                    {history.length === 0 ? (
                        <Text style={styles.dim}>Chưa có ván nào. Quất thử một ván đi bro!</Text>
                    ) : (
                        history.map(r => (
                            <View key={r.id} style={styles.roundRow}>
                                <Text style={styles.roundWhen}>
                                    {new Date(r.at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                                <Text style={styles.roundText}>
                                    {EMOJI_MAP[r.player]} vs {EMOJI_MAP[r.cpu]}
                                </Text>
                                <Chip compact
                                    style={[
                                        styles.roundChip,
                                        r.result === 'win' && { backgroundColor: '#27ae60' },
                                        r.result === 'lose' && { backgroundColor: '#c0392b' },
                                        r.result === 'draw' && { backgroundColor: '#d97706' },
                                    ]}
                                    textStyle={{ color: '#fff' }}
                                >
                                    {r.result === 'win' ? 'Thắng' : r.result === 'lose' ? 'Thua' : 'Hòa'}
                                </Chip>
                            </View>
                        ))
                    )}
                </Card.Content>
            </Card>

            <Snackbar
                visible={snackbar.visible}
                onDismiss={() => setSnackbar({ visible: false, text: '' })}
                duration={2000}
            >
                {snackbar.text}
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 12, gap: 12, flex: 1 },
    scoreCard: { borderRadius: 16 },
    actionsCard: { borderRadius: 16 },
    historyCard: { borderRadius: 16, flex: 1 },

    scoreRow: { flexDirection: 'row', justifyContent: 'space-between' },
    scoreBox: { alignItems: 'center', flex: 1 },
    bold: { fontWeight: '800' },
    dim: { opacity: 0.7 },

    resultRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 8 },
    pairBox: { alignItems: 'center' },
    bigChip: { paddingVertical: 8, paddingHorizontal: 12, marginTop: 6 },
    bigEmoji: { fontSize: 32 },

    banner: {
        marginTop: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },

    choiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    choiceItem: { alignItems: 'center', flex: 1 },
    badge: { alignSelf: 'center', marginBottom: 6 },
    choiceBtn: { marginHorizontal: 6, borderRadius: 14 },
    choiceEmoji: { fontSize: 28 },

    roundRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 6,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e5e7eb',
    },
    roundWhen: { width: 60, opacity: 0.6 },
    roundText: { flex: 1, fontSize: 16 },
    roundChip: { height: 24 },
});

export default RPS;
