// DashboardDrawer.tsx
import React from 'react';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
    List,
    Divider,
    useTheme,
    Text as PaperText,
} from 'react-native-paper';
import { View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// --- Screens ---
import Profile from './Profile';
import Configs from './Configs/Configs';
import DashboardScreen from './Dashboard';
import MealOrder from './Meal/MealOrder';
import AddMealOrder from './Meal/AddMealOrder';
import MealRate from './Meal/MealRate';
import { List as Request } from './LeaveOffice';
import { AddNew as RequestLeaveOffice } from './LeaveOffice';
import { List as RequestBookingRoom } from './BookingRoom';
import PostDetail from './PostDetail';
import UserDataSection from './UserDataSection';
import WorkSchedule from './WorkSchedule';
import CalendarWork from './CalendarWork';
import { RPS } from './Games';

// 👉 chỉnh path theo dự án của anh
import AddNewOrderRoom from './BookingRoom/sections/AddNew';

const Drawer = createDrawerNavigator();

// nhóm để auto expand
const MEAL_ROUTES = ['MealOrder', 'AddMealOrder', 'MealRate'] as const;
const REQUEST_ROUTES = ['Request', 'RequestLeaveOffice', 'RequestBookingRoom', 'ListLeaveOffice', 'AddNewOrderRoom'] as const;
const SCHEDULE_ROUTES = ['WorkSchedule', 'CalendarWork'] as const;
const FUN_ROUTES = ['RPS'] as const;

const ICON_SIZE = 22;

function CustomDrawerContent(props: DrawerContentComponentProps) {
    const { navigation, state } = props;
    const theme = useTheme();

    const currentRouteName = state?.routes?.[state.index]?.name ?? '';

    const go = (name: string) => () => navigation.navigate(name as never);
    const isActive = (name: string) => currentRouteName === name;

    // màu Material 3—đẹp cả dark mode
    const c = theme.colors as any;
    const activeBg = c.secondaryContainer ?? c.primaryContainer;
    const activeFg = c.onSecondaryContainer ?? c.onPrimaryContainer;
    const baseFg = c.onSurface;
    const ripple = theme.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

    const [mealOpen, setMealOpen] = React.useState(MEAL_ROUTES.includes(currentRouteName as any));
    const [reqOpen, setReqOpen] = React.useState(REQUEST_ROUTES.includes(currentRouteName as any));
    const [schOpen, setSchOpen] = React.useState(SCHEDULE_ROUTES.includes(currentRouteName as any));
    const [funOpen, setFunOpen] = React.useState(FUN_ROUTES.includes(currentRouteName as any));

    React.useEffect(() => {
        setMealOpen(MEAL_ROUTES.includes(currentRouteName as any));
        setReqOpen(REQUEST_ROUTES.includes(currentRouteName as any));
        setSchOpen(SCHEDULE_ROUTES.includes(currentRouteName as any));
        setFunOpen(FUN_ROUTES.includes(currentRouteName as any));
    }, [currentRouteName]);

    // item đẹp: icon align, bo góc, vạch trái khi active
    const NavItem = ({ label, icon, to }: { label: string; icon: string; to: string }) => {
        const active = isActive(to);
        return (
            <View
                style={{
                    marginHorizontal: 10,
                    marginVertical: 3,
                    borderRadius: 12,
                    overflow: 'hidden',
                    backgroundColor: active ? activeBg : 'transparent',
                    position: 'relative',
                }}
            >
                {/* vạch trái khi active */}
                {active && (
                    <View style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: 3, backgroundColor: theme.colors.primary, opacity: 0.9
                    }} />
                )}
                <List.Item
                    title={label}
                    onPress={go(to)}
                    rippleColor={ripple}
                    left={() => (
                        <MaterialIcons
                            name={icon}
                            size={ICON_SIZE}
                            color={active ? activeFg : baseFg}
                            style={{ width: 24, textAlign: 'center', marginRight: 12, marginLeft: 6 }}
                        />
                    )}
                    style={{ paddingVertical: 8, paddingRight: 12, paddingLeft: 6 }}
                    titleStyle={{ color: active ? activeFg : baseFg, fontWeight: active ? '600' : '500' }}
                />
            </View>
        );
    };

    const AccIcon = (name: string) => (p: any) => (
        <MaterialIcons
            name={name}
            size={ICON_SIZE}
            color={p.color}
            style={{ width: 24, textAlign: 'center', marginRight: 12, marginLeft: 6 }}
        />
    );

    const Group = ({
        title, icon, expanded, onPress, children,
    }: {
        title: string;
        icon: string;
        expanded: boolean;
        onPress: () => void;
        children: React.ReactNode;
    }) => (
        <View
            style={{
                marginHorizontal: 8,
                marginVertical: 6,
                borderRadius: 14,
                overflow: 'hidden',
                backgroundColor: theme.colors.surfaceVariant + '00', // nhẹ nhàng
            }}
        >
            <List.Accordion
                title={title}
                expanded={expanded}
                onPress={onPress}
                left={AccIcon(icon)}
                titleStyle={{ color: baseFg, fontWeight: '700', letterSpacing: 0.2 }}
                style={{
                    paddingVertical: 2,
                    backgroundColor: 'transparent',
                }}
            >
                <View style={{ paddingBottom: 6 }}>{children}</View>
            </List.Accordion>
        </View>
    );

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0, paddingBottom: 16 }}>
            {/* Header user (avatar, tên, v.v.) */}
            <UserDataSection {...props} />

            {/* Nhãn nhỏ “CHUNG” */}
            <List.Section>
                <PaperText
                    style={{
                        marginHorizontal: 16,
                        marginTop: 10,
                        marginBottom: 6,
                        color: c.onSurfaceVariant,
                        fontSize: 12,
                        letterSpacing: 1.1,
                    }}
                >
                    CHUNG
                </PaperText>
                <NavItem label="Trang chủ" icon="dashboard" to="Dashboard" />
            </List.Section>

            <Divider style={{ marginVertical: 6, opacity: 0.3 }} />

            {/* Nhóm Ăn ca */}
            <Group title="Ăn ca" icon="fastfood" expanded={mealOpen} onPress={() => setMealOpen(!mealOpen)}>
                <NavItem label="Ăn ca" icon="fastfood" to="MealOrder" />
                <NavItem label="Thêm ăn ca" icon="playlist-add" to="AddMealOrder" />
                <NavItem label="Đánh giá bữa ăn" icon="star" to="MealRate" />
            </Group>

            {/* Nhóm Yêu cầu */}
            <Group title="Yêu cầu" icon="assignment" expanded={reqOpen} onPress={() => setReqOpen(!reqOpen)}>
                <NavItem label="Nghỉ phép" icon="event-note" to="Request" />
                <NavItem label="Thêm nghỉ phép" icon="note-add" to="RequestLeaveOffice" />
                <NavItem label="Đặt lịch phòng họp" icon="meeting-room" to="RequestBookingRoom" />
                <NavItem label="Thêm đặt lịch phòng họp" icon="event-available" to="AddNewOrderRoom" />
                <NavItem label="Danh sách nghỉ phép" icon="view-list" to="ListLeaveOffice" />
            </Group>

            {/* Nhóm Lịch trực */}
            <Group title="Lịch trực" icon="schedule" expanded={schOpen} onPress={() => setSchOpen(!schOpen)}>
                <NavItem label="Lịch trực ca" icon="work-history" to="WorkSchedule" />
                <NavItem label="Lịch trực tháng" icon="calendar-today" to="CalendarWork" />
            </Group>

            {/* Nhóm Giải trí */}
            <Group title="Giải trí" icon="sports-esports" expanded={funOpen} onPress={() => setFunOpen(!funOpen)}>
                <NavItem label="Oẳn tù tì" icon="sports-kabaddi" to="RPS" />
            </Group>

            <Divider style={{ marginVertical: 6, opacity: 0.3 }} />

            {/* Nhãn nhỏ “KHÁC” */}
            <List.Section>
                <PaperText
                    style={{
                        marginHorizontal: 16,
                        marginTop: 6,
                        marginBottom: 6,
                        color: c.onSurfaceVariant,
                        fontSize: 12,
                        letterSpacing: 1.1,
                    }}
                >
                    KHÁC
                </PaperText>
                <NavItem label="Trang cá nhân" icon="person" to="Profile" />
                <NavItem label="Cài đặt" icon="settings" to="Configs" />
            </List.Section>
        </DrawerContentScrollView>
    );
}

export default function DashboardDrawer() {
    return (
        <Drawer.Navigator
            initialRouteName="Dashboard"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                drawerType: 'slide',
                drawerPosition: 'left',
            }}
        >
            {/* Ẩn hết item mặc định của Drawer—ta đã custom */}
            <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Trang Chủ' }} />
            <Drawer.Screen name="PostDetail" component={PostDetail} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Chi tiết bài đăng' }} />

            {/* Yêu cầu */}
            <Drawer.Screen name="Request" component={Request} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Nghỉ phép' }} />
            <Drawer.Screen name="RequestLeaveOffice" component={RequestLeaveOffice} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Thêm nghỉ phép' }} />
            <Drawer.Screen name="RequestBookingRoom" component={RequestBookingRoom} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Đặt lịch phòng họp' }} />
            <Drawer.Screen name="ListLeaveOffice" component={Request} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Nghỉ phép' }} />
            <Drawer.Screen name="AddNewOrderRoom" component={AddNewOrderRoom} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Thêm mới đặt phòng họp' }} />

            {/* Ăn ca */}
            <Drawer.Screen name="MealOrder" component={MealOrder} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Ăn ca' }} />
            <Drawer.Screen name="AddMealOrder" component={AddMealOrder} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Thêm ăn ca' }} />
            <Drawer.Screen name="MealRate" component={MealRate} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Đánh giá bữa ăn' }} />

            {/* Lịch trực */}
            <Drawer.Screen name="WorkSchedule" component={WorkSchedule} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Lịch trực ca' }} />
            <Drawer.Screen name="CalendarWork" component={CalendarWork} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Lịch trực tháng' }} />

            {/* Giải trí */}
            <Drawer.Screen name="RPS" component={RPS} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Giải trí' }} />

            {/* Khác */}
            <Drawer.Screen name="Profile" component={Profile} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Trang cá nhân' }} />
            <Drawer.Screen name="Configs" component={Configs} options={{ drawerItemStyle: { display: 'none' }, headerTitle: 'Cài đặt' }} />
        </Drawer.Navigator>
    );
}
