import { createDrawerNavigator } from '@react-navigation/drawer';
import Profile from './Profile';
import Configs from './Configs/Configs';
import DashboardScreen from './Dashboard';
import MealOrder from './Meal/MealOrder';
import AddMealOrder from './Meal/AddMealOrder';
import MealRate from './Meal/MealRate';
import { List as Request } from './LeaveOffice';
import { List as RequestBookingRoom } from './BookingRoom';
import PostDetail from './PostDetail'
import UserDataSection from './UserDataSection'; // 👈 Thêm dòng này

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { MAIN_COLOR, SUB_COLOR } from '../../config/app';
const Drawer = createDrawerNavigator();

function DashboardDrawer() {
    return (
        <Drawer.Navigator
            initialRouteName="Dashboard"
            drawerContent={(props) => <UserDataSection {...props} />}
            screenOptions={({ route }) => ({
                drawerPosition: 'left',
                drawerType: 'slide',
                headerShown: true,
                drawerActiveBackgroundColor: MAIN_COLOR, // màu nền khi active
                drawerActiveTintColor: 'white', // màu icon và text khi active
                drawerInactiveTintColor: 'black', // màu icon và text khi inactive
                drawerIcon: ({ color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Dashboard':
                            iconName = 'dashboard';
                            break;
                        case 'Profile':
                            iconName = 'person';
                            break;
                        case 'Configs':
                            iconName = 'settings';
                            break;
                        case 'MealOrder':
                            iconName = 'fastfood';
                            break;
                        case 'Request':
                            iconName = 'event-note';
                            break;
                        case 'RequestBookingRoom':
                            iconName = 'meeting-room';
                            break;
                        case 'MealRate':
                            iconName = 'star';
                            break;
                        default:
                            iconName = 'help';
                            break;
                        case 'ListLeaveOffice':
                            iconName = 'view-list';
                            break;
                    }

                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{
                headerTitle: 'Trang Chủ',
                drawerLabel: 'Trang chủ'
            }} />

            <Drawer.Screen
                name="PostDetail"
                component={PostDetail} 
                options={{
                    drawerItemStyle: { display: 'none' },
                    headerTitle: 'Chi tiết bài đăng',
                    drawerLabel: 'Chi tiết bài đăng'
                }}
            />
            <Drawer.Screen name="Request" component={Request} options={{
                headerTitle: 'Nghỉ phép',
                drawerLabel: 'Nghỉ phép'
            }} />

            <Drawer.Screen name="RequestBookingRoom" component={RequestBookingRoom} options={{
                headerTitle: 'Đặt lịch phòng họp',
                drawerLabel: 'Đặt lịch phòng họp'
            }} />
            <Drawer.Screen name="Profile" component={Profile} 
            options={{
                drawerItemStyle: { display: 'none' },
                headerTitle: 'Trang cá nhân',
                drawerLabel: 'Trang cá nhân'
            }} />
            <Drawer.Screen name="MealOrder" component={MealOrder} options={{
                headerTitle: 'Ăn ca',
                drawerLabel: 'Ăn ca'
            }} />
            <Drawer.Screen
                name="AddMealOrder"
                component={AddMealOrder} options={{
                    drawerItemStyle: { display: 'none' },
                    headerTitle: 'Thêm ăn ca',
                    drawerLabel: 'Thêm ăn ca'
                }}
            />
            <Drawer.Screen name="MealRate" component={MealRate} options={{
                drawerItemStyle: { display: 'none' },
                headerTitle: 'Đánh giá bữa ăn',
                drawerLabel: 'Đánh giá bữa ăn'
            }} />
            <Drawer.Screen name="Configs" component={Configs} options={{
                headerTitle: 'Cài đặt',
                drawerLabel: 'Cài đặt'
            }} />
            <Drawer.Screen name="ListLeaveOffice" component={Request} options={{
                headerTitle: 'Nghỉ phép',
                drawerLabel: 'Nghỉ phép',
            }} />
        </Drawer.Navigator>
    );
}

export default DashboardDrawer;
