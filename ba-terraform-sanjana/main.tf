terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "dvopsBrainAcademy" {
  name     = "dvopsBrainAcademy"
  location = "East US"
}

resource "azurerm_kubernetes_cluster" "dvopsAKSCluster" {
  name                = "dvopsAKSCluster"
  location            = azurerm_resource_group.dvopsBrainAcademy.location
  resource_group_name = azurerm_resource_group.dvopsBrainAcademy.name
  dns_prefix          = "brainacademy-aks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v2"
  }

  service_principal {
    client_id     = "93aea1c5-1490-4430-af65-b150ee5cc307"
    client_secret = "Zmj8Q~5B7apYLuua0SIuJ0NKFdLxXctNuPqhtaJN"
  }
}