// import { Tabs } from 'expo-router';
// import { Platform } from 'react-native';
// import { colors } from '@/constants/colors';
// import { typography } from '@/constants/typography';
// import { Chrome as Home, Search, User, Briefcase, Calendar } from 'lucide-react-native';

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: colors.primary[600],
//         tabBarInactiveTintColor: colors.gray[500],
//         tabBarStyle: {
//           borderTopWidth: 1,
//           borderTopColor: colors.gray[200],
//           backgroundColor: colors.white,
//           height: Platform.OS === 'ios' ? 90 : 70,
//           paddingBottom: Platform.OS === 'ios' ? 30 : 10,
//           paddingTop: 10,
//         },
//         tabBarLabelStyle: {
//           ...typography.labelSmall,
//           marginTop: -5,
//         },
//         headerShown: false,
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="services"
//         options={{
//           title: 'Services',
//           tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="bookings"
//         options={{
//           title: 'Bookings',
//           tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="jobs"
//         options={{
//           title: 'Jobs',
//           tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="professional/[id]"
//         options={{
//           href: null, // Hide from tab bar
//         }}
//       />
//       <Tabs.Screen
//         name="book-professional/[id]"
//         options={{
//           href: null, // Hide from tab bar
//         }}
//       />
//     </Tabs>
//   );
// }











// import { Tabs } from 'expo-router';
// import { Platform } from 'react-native';
// import { colors } from '@/constants/colors';
// import { typography } from '@/constants/typography';
// import { Chrome as Home, Search, User, Briefcase, Calendar } from 'lucide-react-native';

// // 1. Import the LocationProvider you created
// import { LocationProvider } from '../(context)/LocationContext';

// export default function TabLayout() {
//   return (
//     // 2. Wrap your entire Tabs component with the provider
//     <LocationProvider>
//       <Tabs
//           screenOptions={{
//             tabBarActiveTintColor: colors.primary[600],
//             tabBarInactiveTintColor: colors.gray[500],
//             tabBarStyle: {
//               borderTopWidth: 1,
//               borderTopColor: colors.gray[200],
//               backgroundColor: colors.white,
//               height: Platform.OS === 'ios' ? 90 : 70,
//               paddingBottom: Platform.OS === 'ios' ? 30 : 10,
//               paddingTop: 10,
//             },
//             tabBarLabelStyle: {
//               ...typography.labelSmall,
//               marginTop: -5,
//             },
//             headerShown: false,
//           }}
//         >
//           <Tabs.Screen
//             name="index"
//             options={{
//               title: 'Home',
//               tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
//             }}
//           />
//           <Tabs.Screen
//             name="services"
//             options={{
//               title: 'Services',
//               tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
//             }}
//           />
//           <Tabs.Screen
//             name="bookings"
//             options={{
//               title: 'Bookings',
//               tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
//             }}
//           />
//           <Tabs.Screen
//             name="jobs"
//             options={{
//               title: 'Jobs',
//               tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
//             }}
//           />
//           <Tabs.Screen
//             name="profile"
//             options={{
//               title: 'Profile',
//               tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
//             }}
//           />
//           <Tabs.Screen
//             name="professional/[id]"
//             options={{
//               href: null, // Hide from tab bar
//             }}
//           />
//           <Tabs.Screen
//             name="book-professional/[id]"
//             options={{
//               href: null, // Hide from tab bar
//             }}
//           />
//         </Tabs>
//     </LocationProvider>
//   );
// }


import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

import {
  Home,
  Search,
  User,
  Briefcase,
  Calendar,
} from 'lucide-react-native';

import { LocationProvider } from '../(context)/LocationContext';

export default function TabsLayout() {
  return (
    <LocationProvider>
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarActiveTintColor: colors.primary[600],
          tabBarInactiveTintColor: colors.gray[500],

          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: colors.gray[200],
            backgroundColor: colors.white,

            height: Platform.OS === 'ios' ? 90 : 70,

            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
            paddingTop: 10,
          },

          tabBarLabelStyle: {
            ...typography.labelSmall,
            marginTop: -5,
          },
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} />
            ),
          }}
        />

        {/* Services */}
        <Tabs.Screen
          name="services"
          options={{
            title: 'Services',
            tabBarIcon: ({ size, color }) => (
              <Briefcase size={size} color={color} />
            ),
          }}
        />

        {/* Bookings */}
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Bookings',
            tabBarIcon: ({ size, color }) => (
              <Calendar size={size} color={color} />
            ),
          }}
        />

        {/* Jobs */}
        <Tabs.Screen
          name="jobs"
          options={{
            title: 'Jobs',
            tabBarIcon: ({ size, color }) => (
              <Search size={size} color={color} />
            ),
          }}
        />

        {/* Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} />
            ),
          }}
        />

        {/* Hidden Professional Details Route */}
        <Tabs.Screen
          name="professional/[id]"
          options={{
            href: null,
          }}
        />

        {/* Hidden Book Professional Route */}
        <Tabs.Screen
          name="book-professional/[id]"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </LocationProvider>
  );
}