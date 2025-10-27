<template>
  <div class="min-h-dvh p-6">
    <div class="max-w-7xl mx-auto">
      <!-- En-tête -->
      <div class="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Back Office Administrateur</h1>
            <p class="mt-2 text-sm text-gray-600">Gestion des restaurateurs Gros<span class="text-[#3AF24B]">mino's</span></p>
          </div>
          <button 
            @click="showAddModal = true"
            class="rounded-lg bg-[#3AF24B] text-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition shadow-md"
          >
            + Ajouter un restaurateur
          </button>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white p-6 rounded-2xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total restaurateurs</p>
            </div>
            <div class="w-12 h-12 bg-[#3AF24B] rounded-full flex items-center justify-center">
              <span class="text-2xl">{{ restaurateurStore.restaurateurs.length }}</span>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Utilisateurs connectés</p>
            </div>
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-2xl">{{ userStore.users.length }}</span>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Rôle</p>
              <p class="text-xl font-bold text-gray-900 mt-1">{{ userStore.currentUser?.role }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <span class="text-2xl">= )</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des restaurateurs -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6 border-b">
          <h2 class="text-xl font-bold text-gray-900">Liste des restaurateurs</h2>
        </div>
        
        <div v-if="restaurateurStore.restaurateurs.length === 0" class="p-12 text-center">
          <p class="text-gray-500 text-lg">Aucun restaurateur enregistré</p>
          <p class="text-gray-400 text-sm mt-2">Cliquez sur le bouton ci-dessus pour ajouter votre premier restaurateur</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Adresse</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ville</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="restaurateur in restaurateurStore.restaurateurs" :key="restaurateur.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">{{ restaurateur.nom }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ restaurateur.adresse }}</div>
                  <div class="text-sm text-gray-500">{{ restaurateur.codePostal }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ restaurateur.ville }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ restaurateur.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="editRestaurateur(restaurateur)"
                    class="text-blue-600 hover:text-blue-900 mr-4 transition"
                  >
                    Modifier
                  </button>
                  <button 
                    @click="confirmDelete(restaurateur)"
                    class="text-red-600 hover:text-red-900 transition"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="closeModals">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b sticky top-0 bg-white">
          <h2 class="text-2xl font-bold text-gray-900">{{ showEditModal ? 'Modifier' : 'Ajouter' }} un restaurateur</h2>
        </div>
        
        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nom du restaurant *</label>
            <input 
              v-model="form.nom" 
              type="text" 
              required 
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
              placeholder="Restaurant Le Gourmet" 
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Adresse *</label>
            <input 
              v-model="form.adresse" 
              type="text" 
              required 
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
              placeholder="123 Rue de la Paix" 
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Code postal *</label>
              <input 
                v-model="form.codePostal" 
                type="text" 
                required 
                pattern="[0-9]{5}"
                class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
                placeholder="75001" 
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Ville *</label>
              <input 
                v-model="form.ville" 
                type="text" 
                required 
                class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
                placeholder="Paris" 
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
            <input 
              v-model="form.email" 
              type="email" 
              required 
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
              placeholder="contact@restaurant.com" 
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Mot de passe {{ showEditModal ? '(laisser vide pour ne pas modifier)' : '*' }}
            </label>
            <input 
              v-model="form.password" 
              type="password" 
              :required="!showEditModal"
              class="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-[#3AF24B] transition" 
              placeholder="••••••••" 
            />
          </div>

          <div class="flex gap-4 pt-4">
            <button 
              type="submit" 
              class="flex-1 rounded-lg bg-black text-white py-3 font-semibold hover:bg-[#3AF24B] hover:text-black transition shadow-md"
            >
              {{ showEditModal ? 'Mettre à jour' : 'Ajouter' }}
            </button>
            <button 
              type="button" 
              @click="closeModals"
              class="rounded-lg border-2 border-gray-200 text-gray-700 px-6 py-3 font-semibold hover:border-gray-400 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="showDeleteModal = false">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Confirmer la suppression</h2>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer le restaurateur <strong>{{ restaurateurToDelete?.nom }}</strong> ? Cette action est irréversible.
        </p>
        <div class="flex gap-4">
          <button 
            @click="deleteRestaurateur"
            class="flex-1 rounded-lg bg-red-600 text-white py-3 font-semibold hover:bg-red-700 transition shadow-md"
          >
            Supprimer
          </button>
          <button 
            @click="showDeleteModal = false"
            class="rounded-lg border-2 border-gray-200 text-gray-700 px-6 py-3 font-semibold hover:border-gray-400 transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '../../stores/user'
import { useRestaurateurStore, type Restaurateur } from '../../stores/restaurateur'
import { useToast } from '../../composables/useToast'

definePageMeta({
  middleware: ['admin']
})

const userStore = useUserStore()
const restaurateurStore = useRestaurateurStore()
const toast = useToast()

useHead({
  title: 'Back Office Administrateur - Grosmino\'s',
  meta: [
    { name: 'description', content: 'Gestion des restaurateurs.' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
})

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const restaurateurToDelete = ref<Restaurateur | null>(null)
const restaurateurToEdit = ref<Restaurateur | null>(null)

const form = reactive({
  nom: '',
  adresse: '',
  codePostal: '',
  ville: '',
  email: '',
  password: '',
})

function resetForm() {
  form.nom = ''
  form.adresse = ''
  form.codePostal = ''
  form.ville = ''
  form.email = ''
  form.password = ''
}

function closeModals() {
  showAddModal.value = false
  showEditModal.value = false
  restaurateurToEdit.value = null
  resetForm()
}

function editRestaurateur(restaurateur: Restaurateur) {
  restaurateurToEdit.value = restaurateur
  form.nom = restaurateur.nom
  form.adresse = restaurateur.adresse
  form.codePostal = restaurateur.codePostal
  form.ville = restaurateur.ville
  form.email = restaurateur.email
  form.password = ''
  showEditModal.value = true
}

function confirmDelete(restaurateur: Restaurateur) {
  restaurateurToDelete.value = restaurateur
  showDeleteModal.value = true
}

function deleteRestaurateur() {
  if (!restaurateurToDelete.value) return

  const result = restaurateurStore.deleteRestaurateur(restaurateurToDelete.value.id)
  
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

  showDeleteModal.value = false
  restaurateurToDelete.value = null
}

function submitForm() {
  if (showEditModal.value && restaurateurToEdit.value) {
    const updateData: any = {
      nom: form.nom,
      adresse: form.adresse,
      codePostal: form.codePostal,
      ville: form.ville,
      email: form.email,
    }
    
    if (form.password) {
      updateData.password = form.password
    }

    const result = restaurateurStore.updateRestaurateur(restaurateurToEdit.value.id, updateData)
    
    if (result.success) {
      toast.success({
        title: 'Succès',
        message: result.message,
        timeout: 3000,
      })
      closeModals()
    } else {
      toast.error({
        title: 'Erreur',
        message: result.message,
        timeout: 3000,
      })
    }
  } else {
    const result = restaurateurStore.addRestaurateur({
      nom: form.nom,
      adresse: form.adresse,
      codePostal: form.codePostal,
      ville: form.ville,
      email: form.email,
      password: form.password,
    })

    if (result.success) {
      toast.success({
        title: 'Succès',
        message: result.message,
        timeout: 3000,
      })
      closeModals()
    } else {
      toast.error({
        title: 'Erreur',
        message: result.message,
        timeout: 3000,
      })
    }
  }
}
</script>

