<template>
  <div class="relative min-h-screen h-full flex items-center ">
    <div class="mx-auto w-full sm:max-w-xl lg:max-w-2xl xl:max-w-3xl">
      <div class="">
        <div class="m-1">
          <img src="~/assets/favicon.ico" alt="phonebook-icon" class="p-2 m-auto" />
        </div>
        <div class="p-4 sm:rounded-sm sm:shadow-md sm:shadow-blue-400">
          <div class="pb-4">
            <p class="text-center text-xl font-bold">Welcome!</p>
            <p class="text-center text-sm font-light mt-3">Please enter your username and password</p>
          </div>
          <form @submit.prevent="handleSubmit" class="" name="login">
            <div class="flex">
              <!-- <label class="block text-gray-700 text-sm font-bold mb-2" for="username" ></label> -->
              <input id="first-name" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="First Name" required />
              <input id="last-name" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Last Name" required />
            </div>
            <div class="flex mt-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                  <!-- <svg style="height: 1em; width: 1em">
                      <use xlink:href="#userIcon"></use>
                  </svg> -->
              </label>
              <input id="username" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Username" required />
            </div>
            <div class="flex mt-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                  <!-- <svg style="height: 1em; width: 1em;">
                      <use xlink:href="#userPass"></use>
                  </svg> -->
              </label>
              <input id="password" type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Password" required />
            </div>
            <div class="flex mt-4">
              <input id="confirm-password" type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Confirm Password" required />
            </div>
            <div class="grid gap-3 mt-4">
              <span id="missingInfo"></span>
              <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onclick="verifyLogin()">Register</button>
              <p class="text-center">
                  Already Registered?
                  <a href="register.html" class="underline cursor-pointer text-blue-500 hover:text-blue-700">Click here to Sign In!</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>