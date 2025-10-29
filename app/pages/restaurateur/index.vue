<template>
  <div class="min-h-dvh p-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dashboard Restaurateur</h1>
            <p class="mt-2 text-sm text-gray-600">Bienvenue <span class="font-semibold text-[#3AF24B]">{{ restaurateurInfo?.nom }}</span></p>
          </div>
          <div class="flex gap-3">
            <button 
              @click="activeTab = 'profile'"
              :class="activeTab === 'profile' ? 'bg-[#3AF24B] text-black' : 'bg-gray-200 text-gray-700'"
              class="rounded-lg px-6 py-3 font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-md"
            >
              Mon Restaurant
            </button>
            <button 
              @click="activeTab = 'foods'"
              :class="activeTab === 'foods' ? 'bg-[#3AF24B] text-black' : 'bg-gray-200 text-gray-700'"
              class="rounded-lg px-6 py-3 font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-md"
            >
              Mes Plats
            </button>
            <button 
              @click="activeTab = 'orders'"
              :class="activeTab === 'orders' ? 'bg-[#3AF24B] text-black' : 'bg-gray-200 text-gray-700'"
              class="rounded-lg px-6 py-3 font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-md relative"
            >
              Commandes
              <span v-if="restaurantOrders.length > 0" class="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {{ restaurantOrders.length }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'profile'" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Informations du Restaurant</h2>
        <form @submit.prevent="updateRestaurantInfo" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nom du restaurant *</label>
            <input 
              v-model="profileForm.nom" 
              type="text" 
              required 
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Adresse *</label>
            <input 
              v-model="profileForm.adresse" 
              type="text" 
              required 
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Code postal *</label>
              <input 
                v-model="profileForm.codePostal" 
                type="text" 
                required 
                pattern="[0-9]{5}"
                class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Ville *</label>
              <input 
                v-model="profileForm.ville" 
                type="text" 
                required 
                class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
            <input 
              v-model="profileForm.email" 
              type="email" 
              required 
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nouveau mot de passe (laisser vide pour ne pas modifier)</label>
            <input 
              v-model="profileForm.password" 
              type="password" 
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
            />
          </div>

          <button 
            type="submit" 
            class="w-full rounded-lg bg-black text-white py-3 font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-md"
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>

      <div v-if="activeTab === 'foods'">
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Mes Plats ({{ myFoods.length }})</h2>
            <button 
              @click="showAddFoodModal = true"
              class="rounded-lg bg-[#3AF24B] text-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition shadow-md"
            >
              + Ajouter un plat
            </button>
          </div>

          <div v-if="myFoods.length === 0" class="p-12 text-center">
            <p class="text-gray-500 text-lg">Aucun plat enregistré</p>
            <p class="text-gray-400 text-sm mt-2">Cliquez sur le bouton ci-dessus pour ajouter votre premier plat</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="food in myFoods" :key="food.id" class="border-2 border-gray-200 rounded-xl p-4 hover:border-[#3AF24B] transition">
              <div class="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img v-if="food.imageUrl" :src="food.imageUrl" :alt="food.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  Pas d'image
                </div>
              </div>
              <h3 class="font-bold text-lg text-gray-900">{{ food.name }}</h3>
              <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ food.description }}</p>
              <p class="text-xl font-bold text-[#3AF24B] mt-3">{{ food.price.toFixed(2) }} €</p>
              <div class="flex gap-2 mt-4">
                <button 
                  @click="editFood(food)"
                  class="flex-1 rounded-lg border-2 border-gray-200 text-gray-700 py-2 text-sm font-semibold hover:border-blue-500 hover:text-blue-500 transition"
                >
                  Modifier
                </button>
                <button 
                  @click="confirmDeleteFood(food)"
                  class="flex-1 rounded-lg border-2 border-red-200 text-red-600 py-2 text-sm font-semibold hover:bg-red-600 hover:text-white transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'orders'" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6 border-b">
          <h2 class="text-2xl font-bold text-gray-900">Commandes du Restaurant ({{ restaurantOrders.length }})</h2>
        </div>

        <div v-if="restaurantOrders.length === 0" class="p-12 text-center">
          <p class="text-gray-500 text-lg">Aucune commande</p>
          <p class="text-gray-400 text-sm mt-2">Les commandes apparaîtront ici</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div v-for="order in restaurantOrders" :key="order.id" class="p-6 hover:bg-gray-50 transition">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-sm text-gray-500">Commande #{{ order.id }}</p>
                <p class="font-semibold text-gray-900">Client: {{ order.userId }}</p>
                <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-[#3AF24B]">{{ order.totalPrice.toFixed(2) }} €</p>
                <span 
                  :class="{
                    'bg-yellow-100 text-yellow-800': order.status === 'pending',
                    'bg-blue-100 text-blue-800': order.status === 'confirmed',
                    'bg-purple-100 text-purple-800': order.status === 'preparing',
                    'bg-green-100 text-green-800': order.status === 'delivered',
                    'bg-red-100 text-red-800': order.status === 'cancelled'
                  }"
                  class="inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
            </div>

            <div class="space-y-2 mb-4">
              <p class="font-semibold text-sm text-gray-700">Articles :</p>
              <div v-for="item in order.items" :key="item.id" class="flex justify-between text-sm">
                <span class="text-gray-600">{{ item.name }} x{{ item.quantity }}</span>
                <span class="text-gray-900 font-medium">{{ (item.price * item.quantity).toFixed(2) }} €</span>
              </div>
            </div>

            <div class="flex gap-2">
              <div class="flex gap-2 flex-1" v-if="order.status !== 'cancelled' && order.status !== 'delivered'">
                <button 
                  v-if="order.status === 'pending'"
                  @click="updateOrderStatus(order.id, 'confirmed')"
                  class="flex-1 rounded-lg bg-blue-600 text-white py-2 text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Confirmer
                </button>
                <button 
                  v-if="order.status === 'confirmed'"
                  @click="updateOrderStatus(order.id, 'preparing')"
                  class="flex-1 rounded-lg bg-purple-600 text-white py-2 text-sm font-semibold hover:bg-purple-700 transition"
                >
                  En préparation
                </button>
                <button 
                  v-if="order.status === 'preparing'"
                  @click="updateOrderStatus(order.id, 'delivered')"
                  class="flex-1 rounded-lg bg-green-600 text-white py-2 text-sm font-semibold hover:bg-green-700 transition"
                >
                  Livrée
                </button>
                <button 
                  @click="confirmCancelOrder(order)"
                  class="rounded-lg border-2 border-red-200 text-red-600 px-6 py-2 text-sm font-semibold hover:bg-red-600 hover:text-white transition"
                >
                  Annuler
                </button>
              </div>
              <button 
                @click="confirmDeleteOrder(order)"
                class="rounded-lg bg-red-700 text-white px-6 py-2 text-sm font-semibold hover:bg-red-800 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddFoodModal || showEditFoodModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="closeFoodModals">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b sticky top-0 bg-white">
          <h2 class="text-2xl font-bold text-gray-900">{{ showEditFoodModal ? 'Modifier' : 'Ajouter' }} un plat</h2>
        </div>
        
        <form @submit.prevent="submitFoodForm" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nom du plat *</label>
            <input 
              v-model="foodForm.name" 
              type="text" 
              required 
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Description courte *</label>
            <textarea 
              v-model="foodForm.description" 
              required 
              rows="2"
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Description détaillée</label>
            <textarea 
              v-model="foodForm.grosseDescription" 
              rows="4"
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Prix (€) *</label>
            <input 
              v-model.number="foodForm.price" 
              type="number" 
              step="0.1"
              min="0"
              required 
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Image du plat</label>
            
            <!-- Preview de l'image -->
            <div v-if="foodForm.imageUrl || imagePreview" class="mb-4 relative inline-block">
              <img 
                :src="imagePreview || foodForm.imageUrl" 
                alt="Aperçu" 
                class="w-48 h-32 object-cover rounded-lg border-2 border-gray-200"
              />
              <button 
                type="button"
                @click="clearImage"
                class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
              >
                ×
              </button>
            </div>

            <!-- Choix entre fichier et URL -->
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Importer un fichier</label>
                <input 
                  type="file" 
                  accept="image/*"
                  @change="handleImageUpload"
                  ref="fileInput"
                  class="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3AF24B] file:text-black hover:file:bg-black hover:file:text-white file:transition file:cursor-pointer"
                />
              </div>
              
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-xs">
                  <span class="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">URL de l'image</label>
                <input 
                  v-model="foodForm.imageUrl" 
                  type="text" 
                  @input="clearFileInput"
                  class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition text-sm" 
                  placeholder="/images/foods/common.jpg"
                />
              </div>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button 
              type="submit" 
              class="flex-1 rounded-lg bg-black text-white py-3 font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-md"
            >
              {{ showEditFoodModal ? 'Mettre à jour' : 'Ajouter' }}
            </button>
            <button 
              type="button" 
              @click="closeFoodModals"
              class="rounded-lg border-2 border-gray-200 text-gray-700 px-6 py-3 font-semibold hover:border-gray-400 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteFoodModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="showDeleteFoodModal = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Confirmer la suppression</h2>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer le plat <strong>{{ foodToDelete?.name }}</strong> ?
        </p>
        <div class="flex gap-4">
          <button 
            @click="deleteFood"
            class="flex-1 rounded-lg bg-red-600 text-white py-3 font-semibold hover:bg-red-700 transition shadow-md"
          >
            Supprimer
          </button>
          <button 
            @click="showDeleteFoodModal = false"
            class="rounded-lg border-2 border-gray-200 text-gray-700 px-6 py-3 font-semibold hover:border-gray-400 transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>

    <div v-if="showCancelOrderModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="showCancelOrderModal = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Confirmer l'annulation</h2>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir annuler la commande <strong>#{{ orderToCancel?.id }}</strong> ?
        </p>
        <div class="flex gap-4">
          <button 
            @click="cancelOrder"
            class="flex-1 rounded-lg bg-red-600 text-white py-3 font-semibold hover:bg-red-700 transition shadow-md"
          >
            Annuler la commande
          </button>
          <button 
            @click="showCancelOrderModal = false"
            class="rounded-lg border-2 border-gray-200 text-gray-700 px-6 py-3 font-semibold hover:border-gray-400 transition"
          >
            Retour
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteOrderModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="showDeleteOrderModal = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Confirmer la suppression</h2>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer définitivement la commande <strong>#{{ orderToDelete?.id }}</strong> ? Cette action est irréversible.
        </p>
        <div class="flex gap-4">
          <button 
            @click="deleteOrder"
            class="flex-1 rounded-lg bg-red-700 text-white py-3 font-semibold hover:bg-red-800 transition shadow-md"
          >
            Supprimer définitivement
          </button>
          <button 
            @click="showDeleteOrderModal = false"
            class="rounded-lg border-2 border-gray-200 text-gray-700 px-6 py-3 font-semibold hover:border-gray-400 transition"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { useRestaurateurStore, type Restaurateur } from '../../stores/restaurateur'
import { useFoodStore, type Food } from '../../stores/food'
import { useOrderStore, type Order, type OrderStatus } from '../../stores/order'
import { useToast } from '../../composables/useToast'

definePageMeta({
  middleware: ['restaurateur']
})

const userStore = useUserStore()
const restaurateurStore = useRestaurateurStore()
const foodStore = useFoodStore()
const orderStore = useOrderStore()
const toast = useToast()

useHead({
  title: 'Dashboard Restaurateur - Grosmino\'s',
  meta: [
    { name: 'description', content: 'Gérez votre restaurant et vos plats.' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

onMounted(() => {
  initProfileForm()
  setTimeout(() => {
    forceUpdate.value++
  }, 100)
})

const activeTab = ref<'profile' | 'foods' | 'orders'>('profile')
const forceUpdate = ref(0)

const restaurateurInfo = computed(() => {
  forceUpdate.value
  if (!userStore.currentUser?.restaurateurId) return null
  return restaurateurStore.getRestaurateurById(userStore.currentUser.restaurateurId)
})

const myFoods = computed(() => {
  forceUpdate.value
  if (!userStore.currentUser?.restaurateurId) return []
  return foodStore.getFoodsByRestaurant(userStore.currentUser.restaurateurId)
})

const restaurantOrders = computed(() => {
  if (!userStore.currentUser?.restaurateurId) return []
  const restaurantId = userStore.currentUser.restaurateurId
  
  return orderStore.orders.filter(order => {
    return order.items.some(item => item.restaurantId.toString() === restaurantId)
  })
})

const profileForm = reactive({
  nom: '',
  adresse: '',
  codePostal: '',
  ville: '',
  email: '',
  password: '',
})

function initProfileForm() {
  if (restaurateurInfo.value) {
    profileForm.nom = restaurateurInfo.value.nom
    profileForm.adresse = restaurateurInfo.value.adresse
    profileForm.codePostal = restaurateurInfo.value.codePostal
    profileForm.ville = restaurateurInfo.value.ville
    profileForm.email = restaurateurInfo.value.email
    profileForm.password = ''
  }
}

function updateRestaurantInfo() {
  if (!userStore.currentUser?.restaurateurId) return

  const updateData: any = {
    nom: profileForm.nom,
    adresse: profileForm.adresse,
    codePostal: profileForm.codePostal,
    ville: profileForm.ville,
    email: profileForm.email,
  }

  if (profileForm.password) {
    updateData.password = profileForm.password
  }

  const result = restaurateurStore.updateRestaurateur(userStore.currentUser.restaurateurId, updateData)

  if (result.success) {
    if (userStore.currentUser) {
      userStore.currentUser.name = profileForm.nom
      userStore.currentUser.email = profileForm.email
      if (profileForm.password) {
        userStore.currentUser.password = profileForm.password
      }
    }

    toast.success({
      title: 'Succès',
      message: result.message,
      timeout: 3000,
    })
    profileForm.password = ''
  } else {
    toast.error({
      title: 'Erreur',
      message: result.message,
      timeout: 3000,
    })
  }
}

const showAddFoodModal = ref(false)
const showEditFoodModal = ref(false)
const showDeleteFoodModal = ref(false)
const foodToEdit = ref<Food | null>(null)
const foodToDelete = ref<Food | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string>('')

const foodForm = reactive({
  name: '',
  description: '',
  grosseDescription: '',
  price: 0,
  imageUrl: '',
})

function resetFoodForm() {
  foodForm.name = ''
  foodForm.description = ''
  foodForm.grosseDescription = ''
  foodForm.price = 0
  foodForm.imageUrl = ''
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Vérifier que c'est bien une image
  if (!file.type.startsWith('image/')) {
    toast.error({
      title: 'Erreur',
      message: 'Veuillez sélectionner un fichier image',
      timeout: 3000,
    })
    return
  }
  
  // Vérifier la taille du fichier (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    toast.error({
      title: 'Erreur',
      message: 'L\'image ne doit pas dépasser 5 Mo',
      timeout: 3000,
    })
    return
  }
  
  // Convertir l'image en base64
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    imagePreview.value = result
    foodForm.imageUrl = result
  }
  reader.onerror = () => {
    toast.error({
      title: 'Erreur',
      message: 'Erreur lors de la lecture du fichier',
      timeout: 3000,
    })
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  foodForm.imageUrl = ''
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function clearFileInput() {
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function closeFoodModals() {
  showAddFoodModal.value = false
  showEditFoodModal.value = false
  foodToEdit.value = null
  resetFoodForm()
}

function editFood(food: Food) {
  foodToEdit.value = food
  foodForm.name = food.name
  foodForm.description = food.description
  foodForm.grosseDescription = food.grosseDescription || ''
  foodForm.price = food.price
  foodForm.imageUrl = food.imageUrl || ''
  imagePreview.value = '' // On utilise directement imageUrl pour l'édition
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  showEditFoodModal.value = true
}

function confirmDeleteFood(food: Food) {
  foodToDelete.value = food
  showDeleteFoodModal.value = true
}

function deleteFood() {
  if (!foodToDelete.value) return

  const result = foodStore.deleteFood(foodToDelete.value.id)

  if (result.success) {
    toast.success({
      title: 'Succès',
      message: result.message,
      timeout: 3000,
    })
  } else {
    toast.error({
      title: 'Erreur',
      message: result.message,
      timeout: 3000,
    })
  }

  showDeleteFoodModal.value = false
  foodToDelete.value = null
}

function submitFoodForm() {
  if (!userStore.currentUser?.restaurateurId) return

  if (showEditFoodModal.value && foodToEdit.value) {
    const result = foodStore.updateFood(foodToEdit.value.id, {
      name: foodForm.name,
      description: foodForm.description,
      grosseDescription: foodForm.grosseDescription,
      price: foodForm.price,
      imageUrl: foodForm.imageUrl,
    })

    if (result.success) {
      toast.success({
        title: 'Succès',
        message: result.message,
        timeout: 3000,
      })
      closeFoodModals()
    } else {
      toast.error({
        title: 'Erreur',
        message: result.message,
        timeout: 3000,
      })
    }
  } else {
    const result = foodStore.addFood({
      restaurantId: userStore.currentUser.restaurateurId,
      name: foodForm.name,
      description: foodForm.description,
      grosseDescription: foodForm.grosseDescription,
      price: foodForm.price,
      imageUrl: foodForm.imageUrl,
    })

    if (result.success) {
      toast.success({
        title: 'Succès',
        message: result.message,
        timeout: 3000,
      })
      closeFoodModals()
    } else {
      toast.error({
        title: 'Erreur',
        message: result.message,
        timeout: 3000,
      })
    }
  }
}

const showCancelOrderModal = ref(false)
const showDeleteOrderModal = ref(false)
const orderToCancel = ref<Order | null>(null)
const orderToDelete = ref<Order | null>(null)

function confirmCancelOrder(order: Order) {
  orderToCancel.value = order
  showCancelOrderModal.value = true
}

function cancelOrder() {
  if (!orderToCancel.value) return

  orderStore.updateOrderStatus(orderToCancel.value.id, 'cancelled')
  
  toast.success({
    title: 'Commande annulée',
    message: `La commande #${orderToCancel.value.id} a été annulée`,
    timeout: 3000,
  })

  showCancelOrderModal.value = false
  orderToCancel.value = null
}

function confirmDeleteOrder(order: Order) {
  orderToDelete.value = order
  showDeleteOrderModal.value = true
}

function deleteOrder() {
  if (!orderToDelete.value) return

  const success = orderStore.deleteOrder(orderToDelete.value.id)
  
  if (success) {
    toast.success({
      title: 'Commande supprimée',
      message: `La commande #${orderToDelete.value.id} a été supprimée définitivement`,
      timeout: 3000,
    })
  } else {
    toast.error({
      title: 'Erreur',
      message: 'Impossible de supprimer la commande',
      timeout: 3000,
    })
  }

  showDeleteOrderModal.value = false
  orderToDelete.value = null
}

function updateOrderStatus(orderId: number, status: OrderStatus) {
  orderStore.updateOrderStatus(orderId, status)
  
  toast.success({
    title: 'Statut mis à jour',
    message: `La commande #${orderId} est maintenant ${getStatusLabel(status)}`,
    timeout: 3000,
  })
}

function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    preparing: 'En préparation',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  }
  return labels[status] || status
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}
</script>

