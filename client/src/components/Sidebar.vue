<template>
    <aside :class="`${is_expanded ? 'is-expanded' : ''}`">
        <div class="logo">
            <img src="../assets/nuwa-s-logo.png" alt="Nuwa">
        </div>

        <div class="menu-toggle-wrap">
            <button class="menu-toggle" @click="ToggleMenu">
                <span class="material-icons-round">keyboard_double_arrow_right</span>
            </button>       
        </div>

        <div class="menu">
            <router-link class="button" to="/">
                <span class="material-icons-round">grid_view</span>
                <span class="text">Dashboard</span>
            </router-link>
            <router-link class="button" to="/products" exact-active-class="active">
                <span class="material-icons-round">inventory_2</span>
                <span class="text">Products</span>
            </router-link>
            <router-link class="button" to="/inventory">
                <span class="material-icons-round">inventory</span>
                <span class="text">Inventory</span>
            </router-link>
            <router-link class="button" to="/settings">
                <span class="material-icons-round">settings</span>
                <span class="text">Settings</span>
            </router-link>
            <router-link class="button" to="/users">
                <span class="material-icons-round">badge</span>
                <span class="text">Users</span>
            </router-link>
        </div>

        <div class="flex"></div>

        <div class="menu user-section">
            <div class="user-info" :class="{ 'is-expanded': is_expanded }">
                <!-- <img src="../assets/sample-employee.jpg" alt="User Profile" class="profile-pic"> -->
                <span class="profile-pic">
                    <span class="material-icons-round">account_circle</span>
                </span>
                <div v-if="is_expanded && user">
                    <p class="user-name">{{ user.user_name }}</p>
                    <p class="user-role">{{ user.position }}</p>
                </div>
            </div>
            <router-link class="button" to="/signout">
                <span class="material-icons-round">logout</span>
                <span class="text" v-if="is_expanded">Sign Out</span>
            </router-link>
        </div>
    </aside>
</template>

<script setup>
import { ref } from 'vue'

const is_expanded = ref(localStorage.getItem("is_expanded") === "true")
const user = JSON.parse(localStorage.getItem('user'));

const ToggleMenu = () => {
    is_expanded.value = !is_expanded.value
    localStorage.setItem("is_expanded", is_expanded.value)
}
</script>

<style lang="scss" scoped>
aside {
    display: flex;
    flex-direction: column;
    width: 80px;
    min-height: 100vh;
    overflow: hidden;
    padding: 1rem;
    background-color: #F8C963; /* Updated background color */
    color: var(--grey); /* Updated text color */
    transition: width 0.2s ease-out;

    .flex {
        flex: 1 1 0%;
    }

    .logo {
        margin-bottom: 1rem;

        img {
            width: 2rem;
        }
    }

    .menu-toggle-wrap {
        display: grid;
        margin-bottom: 1rem;
        position: relative;
        top: 0;
        transition: 0.2s ease-out;

        .menu-toggle {
            transition: 0.2s ease-in-out;

            .material-icons-round {
                font-size: 2rem;
                color: var(--grey); /* Updated icon color */
                transition: 0.2s ease-out;
            }

            &:hover {
                .material-icons-round {
                    color: var(--brown);
                    transform: translateX(0.5rem);
                }
            }
        }
    }

    .menu {
        .button {
            display: flex;
            align-items: center;
            text-decoration: none;
            padding: 0.5rem; /* Updated padding */
            margin-bottom: 1rem; /* Added margin between buttons */
            border-radius: 8px; /* Added border radius */
            transition: background-color 0.2s ease-in-out;

            .material-icons-round {
                font-size: 2rem;
                color:var(--grey); /* Updated icon color */
                transition: color 0.2s ease-in-out;
                margin-right: 0; /* Ensure icon is always aligned */
            }

            .text {
                color:var(--grey); /* Updated text color */
                margin-left: 1rem; /* Added margin for spacing */
                transition: opacity 0.2s ease-in-out;
                opacity: 0; /* Hide text by default */
                white-space: nowrap; /* Prevent text from wrapping */
            }

            &:hover, &.active {
                background-color: #FFF7E6; /* Updated hover background color */
                .material-icons-round, .text {
                    color: var(--brown); /* Updated hover text color */
                }
            }
        }
    }

    .user-section {
        .user-info {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;

            .material-icons-round {
                font-size: 2.5rem;
                color:var(--grey); /* Updated icon color */
                transition: color 0.2s ease-in-out;
                margin-right: 0; /* Ensure icon is always aligned */
                margin-left: 5px;
            }

            .profile-pic {
                border-radius: 50%;
                width: 40px;
                height: 40px;
                margin-right: 0; /* Remove margin when collapsed */
                transition: margin-right 0.2s ease-in-out;
            }

            .user-name, .user-role {
                margin: 0;
                transition: opacity 0.2s ease-in-out;
                opacity: 0; /* Hide by default */
                white-space: nowrap;
            }

            &.is-expanded .profile-pic {
                margin-right: 2rem; /* Add margin when expanded */
            }

            &.is-expanded .user-name, &.is-expanded .user-role {
                opacity: 1; /* Show text when expanded */
                color:var(--brown);
                font-weight:550;
            }
        }
    }

    &.is-expanded {
        width: 250px; /* Adjusted width for expanded state */

        .menu-toggle-wrap {
            display: flex;
            justify-content: flex-end;
            top: -3rem;
            .menu-toggle {
                transform: rotate(-180deg);
            }
        }

        .menu .button .text {
            opacity: 1; /* Show text when expanded */
        }

        .button {
            .material-icons-round {
                margin-right: 1rem; /* Add margin when expanded */
            }
        }

        .logo {
            margin-bottom: 0;
        }
    }

    @media (max-width: 768px) {
        position: fixed;
        z-index: 99;
    }
}
</style>
